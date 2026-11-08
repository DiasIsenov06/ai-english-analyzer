import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/requestAuth";
type Context = { params: Promise<{ dayId: string }> };
export async function GET(request: Request, { params }: Context) {
  const auth = await authenticate(request);
  if (auth.response) return auth.response;
  const dayIndex = Number((await params).dayId);
  if (!Number.isInteger(dayIndex) || dayIndex < 1 || dayIndex > 28) return NextResponse.json({ error: "Invalid dayId" }, { status: 400 });
  const plan = await prisma.studyPlan.findFirst({ where: { userId: auth.userId }, orderBy: { createdAt: "desc" } });
  const day = plan && await prisma.studyPlanDay.findFirst({ where: { planId: plan.id, dayIndex }, include: { tasks: { orderBy: { orderIndex: "asc" } } } });
  return day ? NextResponse.json({ day }) : NextResponse.json({ error: "Day not found" }, { status: 404 });
}
export async function PATCH(request: Request) {
  const auth = await authenticate(request);
  if (auth.response) return auth.response;
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const { dayId, status, notes } = body ?? {};
  if (typeof dayId !== "string" || !["pending", "completed", "skipped"].includes(status) ||
      (notes !== undefined && (typeof notes !== "string" || notes.length > 2000))) return NextResponse.json({ error: "Invalid day update" }, { status: 400 });
  const ownDay = await prisma.studyPlanDay.findFirst({ where: { id: dayId, plan: { userId: auth.userId } } });
  if (!ownDay) return NextResponse.json({ error: "Day not found" }, { status: 404 });
  const day = await prisma.$transaction(async tx => {
    const updated = await tx.studyPlanDay.update({ where: { id: dayId }, data: { status, notes } });
    await tx.studyTask.updateMany({ where: { dayId }, data: { status: status === "completed" ? "completed" : "pending" } });
    return updated;
  });
  return NextResponse.json({ ok: true, day });
}
