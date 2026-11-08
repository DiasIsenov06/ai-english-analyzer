import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/requestAuth";

export async function POST(request: Request) {
  try {
    const auth = await authenticate(request);
    if (auth.response) return auth.response;
    const userId = auth.userId;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        hasCompletedOnboarding: true,
      },
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        level: updatedUser.level,
        goal: updatedUser.goal,
        hasCompletedOnboarding: updatedUser.hasCompletedOnboarding,
      },
    });
  } catch (e) {
    console.error("Complete onboarding error:", e);

    return NextResponse.json(
      { error: "Не удалось обновить onboarding статус" },
      { status: 500 }
    );
  }
}
