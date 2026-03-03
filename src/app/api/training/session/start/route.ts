import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

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

    const existing = await prisma.trainingSession.findFirst({
      where: { userId: payload.userId, status: "active" },
      orderBy: { createdAt: "desc" },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const session = await prisma.trainingSession.create({
      data: {
        userId: payload.userId,
        status: "active",
        metaJson: JSON.stringify({
          source: "adhoc",
          createdFrom: "dashboard",
        }),
      },
    });

    const intro =
      "Hi! I'm your AI English tutor. Today we'll do a short daily training: warm-up, grammar micro-lesson, vocabulary and a mini-task. Ready?";

    await prisma.trainingMessage.create({
      data: {
        sessionId: session.id,
        role: "assistant",
        content: intro,
      },
    });

    const withMessages = await prisma.trainingSession.findUnique({
      where: { id: session.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    return NextResponse.json(withMessages);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Ошибка старта сессии" },
      { status: 500 }
    );
  }
}

