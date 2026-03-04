import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, level, goal } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
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
      data: { email, password: hashed, level: level || null, goal: goal || null },
    });
    const token = await createToken({ userId: user.id, email: user.email });
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        level: user.level,
        goal: user.goal,
      },
    });
  } catch (e: unknown) {
    console.error("Register error:", e);
    const prisma = e as { code?: string };
    const isDuplicate = prisma?.code === "P2002";
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
