import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

type Params = { id: string };

export async function POST(
  request: Request,
  { params }: { params: Params }
) {
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

    const session = await prisma.trainingSession.findUnique({
      where: { id: params.id },
    });
    if (!session || session.userId !== payload.userId) {
      return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const { metrics } = body as { metrics?: unknown };

    const updated = await prisma.trainingSession.update({
      where: { id: session.id },
      data: {
        status: "completed",
        metricsJson: metrics ? JSON.stringify(metrics) : session.metricsJson,
      },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Ошибка завершения сессии" },
      { status: 500 }
    );
  }
}

