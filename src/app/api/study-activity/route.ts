import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const sessions = await prisma.trainingSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        createdAt: true,
        metricsJson: true,
      },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Study activity GET error:", error);
    return NextResponse.json(
      { error: "Failed to load study activity" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, minutes, source = "training" } = await request.json();

    if (!userId || !minutes) {
      return NextResponse.json(
        { error: "userId and minutes are required" },
        { status: 400 }
      );
    }

    const session = await prisma.trainingSession.create({
      data: {
        userId,
        status: "completed",
        metaJson: JSON.stringify({ source }),
        metricsJson: JSON.stringify({ minutes }),
      },
    });

    return NextResponse.json({ ok: true, session });
  } catch (error) {
    console.error("Study activity POST error:", error);
    return NextResponse.json(
      { error: "Failed to save study activity" },
      { status: 500 }
    );
  }
}