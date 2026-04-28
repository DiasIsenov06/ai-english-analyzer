import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const plan = await prisma.studyPlan.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        days: {
          orderBy: {
            dayIndex: "asc",
          },
        },
      },
    });

    return NextResponse.json({ plan });
  } catch (e) {
    console.error("Load current plan error:", e);

    return NextResponse.json(
      { error: "Failed to load current plan" },
      { status: 500 }
    );
  }
}