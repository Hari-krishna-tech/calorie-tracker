import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { getEntriesByDate } from "@/lib/dal";

export async function GET(request: NextRequest) {
  const { userId } = await verifySession();
  const date = request.nextUrl.searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const entries = await getEntriesByDate(userId, date);
  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const { userId } = await verifySession();
  const body = await request.json();
  const { foodId, quantity, mealType, date } = body;
  const entry = await prisma.foodEntry.create({
    data: { foodId, quantity, mealType, date, userId },
    include: { food: true },
  });
  return NextResponse.json(entry);
}
