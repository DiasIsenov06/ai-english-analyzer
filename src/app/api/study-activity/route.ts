import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/requestAuth";

export async function GET(request: Request) {
  try {
    const auth = await authenticate(request);
    if (auth.response) return auth.response;
    const userId = auth.userId;

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
    const auth = await authenticate(request);
    if (auth.response) return auth.response;
    const userId = auth.userId;
    const { minutes, source = "training" } = await request.json();

    if (typeof minutes !== "number" || !Number.isFinite(minutes) || minutes <= 0 || minutes > 240 || typeof source !== "string" || source.length > 50) {
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
