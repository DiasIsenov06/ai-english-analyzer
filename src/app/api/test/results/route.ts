import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Недействительный токен" }, { status: 401 });
    }
    const body = await request.json();
    const { score, total, level, grammarScore, vocabularyScore, correctionScore, strengths, weaknesses } = body;
    const result = await prisma.testResult.create({
      data: {
        userId: payload.userId,
        score: Number(score),
        total: Number(total),
        level: String(level),
        grammarScore: grammarScore ?? null,
        vocabularyScore: vocabularyScore ?? null,
        correctionScore: correctionScore ?? null,
        strengths: strengths ? JSON.stringify(strengths) : null,
        weaknesses: weaknesses ? JSON.stringify(weaknesses) : null,
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сохранения" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Недействительный токен" }, { status: 401 });
    }
    const results = await prisma.testResult.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return NextResponse.json(results);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}
