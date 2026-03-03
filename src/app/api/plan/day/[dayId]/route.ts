import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

type Params = { dayId: string };

export async function PATCH(
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

    const body = await request.json();
    const { status, notes } = body as {
      status?: string;
      notes?: string;
    };

    const day = await prisma.studyPlanDay.findUnique({
      where: { id: params.dayId },
      include: { plan: true },
    });

    if (!day || day.plan.userId !== payload.userId) {
      return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    }

    const updated = await prisma.studyPlanDay.update({
      where: { id: params.dayId },
      data: {
        status: status ?? day.status,
        notes: notes ?? day.notes,
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Ошибка обновления дня плана" },
      { status: 500 }
    );
  }
}

