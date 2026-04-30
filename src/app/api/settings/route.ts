import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const settings = await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", dailyCalorieGoal: 2000 },
  });
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const { dailyCalorieGoal } = await request.json();
  const settings = await prisma.settings.upsert({
    where: { id: "default" },
    update: { dailyCalorieGoal },
    create: { id: "default", dailyCalorieGoal },
  });
  return NextResponse.json(settings);
}
