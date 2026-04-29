import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { dayId: string };

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const dayIndex = Number(params.dayId);

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (Number.isNaN(dayIndex)) {
      return NextResponse.json(
        { error: "Invalid dayId" },
        { status: 400 }
      );
    }

    const plan = await prisma.studyPlan.findFirst({
      where: {
        userId,
        metaJson: {
          contains: "simple-logic-generator",
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    const day = await prisma.studyPlanDay.findFirst({
      where: {
        planId: plan.id,
        dayIndex,
      },
      include: {
        tasks: {
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
    });

    if (!day) {
      return NextResponse.json(
        { error: "Day not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ day });
  } catch (e) {
    console.error("Load day lesson error:", e);

    return NextResponse.json(
      { error: "Failed to load day lesson" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { dayId, status, notes } = await request.json();

    if (!dayId || !status) {
      return NextResponse.json(
        { error: "dayId and status are required" },
        { status: 400 }
      );
    }

    const updatedDay = await prisma.studyPlanDay.update({
      where: { id: dayId },
      data: {
        status,
        notes: notes ?? undefined,
      },
    });

    if (status === "completed") {
      await prisma.studyTask.updateMany({
        where: { dayId },
        data: {
          status: "completed",
        },
      });
    }

    return NextResponse.json({
      ok: true,
      day: updatedDay,
    });
  } catch (e) {
    console.error("Update day lesson error:", e);

    return NextResponse.json(
      { error: "Failed to update day lesson" },
      { status: 500 }
    );
  }
}