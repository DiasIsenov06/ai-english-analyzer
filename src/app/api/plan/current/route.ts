import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/requestAuth";

export async function GET(request: Request) {
  try {
    const auth = await authenticate(request);
    if (auth.response) return auth.response;
    const userId = auth.userId;

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
