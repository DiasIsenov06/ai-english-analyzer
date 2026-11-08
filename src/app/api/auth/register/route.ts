import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken } from "@/lib/auth";
import { validCredentials } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { email, password, level, goal } = await request.json();

    if (!validCredentials(email, password)) {
      return NextResponse.json(
        { error: "Укажите email и пароль от 8 символов (не более 72 байт)" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        level: level || null,
        goal: goal || null,
      },
    });

    const token = await createToken({ userId: user.id, email: user.email });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        level: user.level,
        goal: user.goal,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
      },
    });
  } catch (e: unknown) {
    console.error("Register error:", e);
    const prismaError = e as { code?: string };
    const isDuplicate = prismaError?.code === "P2002";

    return NextResponse.json(
      {
        error: isDuplicate
          ? "Пользователь с таким email уже существует"
          : "Ошибка сервера. Проверьте подключение к базе данных.",
      },
      { status: 500 }
    );
  }
}
