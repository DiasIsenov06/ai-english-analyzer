import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/requestAuth";
import { validResult } from "@/lib/validation";
export async function GET(request: Request) {
  const auth = await authenticate(request);
  if (auth.response) return auth.response;
  const result = await prisma.testResult.findFirst({ where: { userId: auth.userId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ result });
}
export async function POST(request: Request) {
  const auth = await authenticate(request);
  if (auth.response) return auth.response;
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!body || !validResult(body)) return NextResponse.json({ error: "Некорректный результат теста" }, { status: 400 });
  const { score, total, level, grammarScore, vocabularyScore, correctionScore, strengths, weaknesses } = body;
  const result = await prisma.testResult.create({ data: {
    userId: auth.userId, score, total, level, grammarScore, vocabularyScore, correctionScore,
    strengths: JSON.stringify(strengths ?? []), weaknesses: JSON.stringify(weaknesses ?? []),
  } });
  return NextResponse.json({ ok: true, result });
}
