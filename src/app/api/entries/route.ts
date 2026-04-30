import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const entries = await prisma.foodEntry.findMany({
    where: { date },
    include: { food: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { foodId, quantity, mealType, date } = body;
  const entry = await prisma.foodEntry.create({
    data: { foodId, quantity, mealType, date },
    include: { food: true },
  });
  return NextResponse.json(entry);
}
