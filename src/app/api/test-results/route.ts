import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId обязателен" },
        { status: 400 }
      );
    }

    const result = await prisma.testResult.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ result });
  } catch (e) {
    console.error("Get latest test result error:", e);

    return NextResponse.json(
      { error: "Не удалось получить результат теста" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      userId,
      score,
      total,
      level,
      grammarScore,
      vocabularyScore,
      correctionScore,
      strengths,
      weaknesses,
    } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId обязателен" },
        { status: 400 }
      );
    }

    if (score === undefined || total === undefined || !level) {
      return NextResponse.json(
        { error: "Неполные данные результата теста" },
        { status: 400 }
      );
    }

    const existing = await prisma.testResult.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    let savedResult;

    if (existing) {
      savedResult = await prisma.testResult.update({
        where: { id: existing.id },
        data: {
          score,
          total,
          level,
          grammarScore,
          vocabularyScore,
          correctionScore,
          strengths: JSON.stringify(strengths ?? []),
          weaknesses: JSON.stringify(weaknesses ?? []),
        },
      });
    } else {
      savedResult = await prisma.testResult.create({
        data: {
          userId,
          score,
          total,
          level,
          grammarScore,
          vocabularyScore,
          correctionScore,
          strengths: JSON.stringify(strengths ?? []),
          weaknesses: JSON.stringify(weaknesses ?? []),
        },
      });
    }

    return NextResponse.json({
      ok: true,
      result: savedResult,
    });
  } catch (e) {
    console.error("Save test result error:", e);

    return NextResponse.json(
      { error: "Не удалось сохранить результат теста" },
      { status: 500 }
    );
  }
}