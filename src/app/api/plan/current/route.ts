import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
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

    const plan = await prisma.studyPlan.findFirst({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
    });

    if (!plan) {
      return NextResponse.json({ plan: null, days: [] });
    }

    const days = await prisma.studyPlanDay.findMany({
      where: { planId: plan.id },
      orderBy: { dayIndex: "asc" },
    });

    return NextResponse.json({ plan, days });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Ошибка загрузки плана" },
      { status: 500 }
    );
  }
}

