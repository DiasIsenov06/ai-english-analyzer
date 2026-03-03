import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { generateStudyPlan, type SkillBreakdown } from "@/lib/aiClient";

export async function POST(request: Request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Недействительный токен" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const lastResult = await prisma.testResult.findFirst({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
    });

    // Вычисляем разбивку по навыкам (если нет данных — мягкие дефолты)
    const baseLevel = user.level ?? lastResult?.level ?? "B1";
    const skills: SkillBreakdown = {
      level: baseLevel,
      goal: user.goal ?? null,
      grammar:
        lastResult?.grammarScore != null && lastResult.total > 0
          ? Math.round((lastResult.grammarScore / 5) * 100)
          : 60,
      vocabulary:
        lastResult?.vocabularyScore != null && lastResult.total > 0
          ? Math.round((lastResult.vocabularyScore / 5) * 100)
          : 60,
      reading: 65,
      listening: 60,
      writing: 55,
      speaking: 55,
      weakestSkill: "Grammar",
    };

    if (lastResult?.weaknesses) {
      try {
        const arr = JSON.parse(lastResult.weaknesses) as string[];
        if (arr && arr.length > 0) {
          skills.weakestSkill = arr[0];
        }
      } catch {
        // ignore
      }
    }

    const planPayload = await generateStudyPlan(skills);

    const createdPlan = await prisma.$transaction(async (tx) => {
      const plan = await tx.studyPlan.create({
        data: {
          userId: payload.userId,
          metaJson: JSON.stringify(planPayload.meta),
        },
      });

      await tx.studyPlanDay.createMany({
        data: planPayload.days.map((d) => ({
          planId: plan.id,
          dayIndex: d.dayIndex,
          date: new Date(d.date),
          dataJson: JSON.stringify({
            focus: d.focus,
            blocks: d.blocks,
          }),
        })),
      });

      const days = await tx.studyPlanDay.findMany({
        where: { planId: plan.id },
        orderBy: { dayIndex: "asc" },
      });

      return { plan, days };
    });

    return NextResponse.json(createdPlan);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Ошибка генерации плана" },
      { status: 500 }
    );
  }
}

