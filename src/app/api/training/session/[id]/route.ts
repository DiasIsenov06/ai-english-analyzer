import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

type Params = { id: string };

export async function GET(
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
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!session || session.userId !== payload.userId) {
      return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Ошибка загрузки сессии" },
      { status: 500 }
    );
  }
}

