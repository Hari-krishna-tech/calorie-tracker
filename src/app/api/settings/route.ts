import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { getUserSettings } from "@/lib/dal";

export async function GET() {
  const { userId } = await verifySession();
  const settings = await getUserSettings(userId);
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const { userId } = await verifySession();
  const { dailyCalorieGoal } = await request.json();
  const existing = await prisma.settings.findFirst({ where: { userId } });
  const settings = existing
    ? await prisma.settings.update({ where: { id: existing.id }, data: { dailyCalorieGoal } })
    : await prisma.settings.create({ data: { userId, dailyCalorieGoal } });
  return NextResponse.json(settings);
}
