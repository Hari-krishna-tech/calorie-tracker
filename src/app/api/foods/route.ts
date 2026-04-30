import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession, getSession } from "@/lib/session";
import { searchFoods } from "@/lib/dal";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "15");

  const session = await getSession();
  const foods = await searchFoods(q, session?.userId ?? null, limit);
  return NextResponse.json(foods);
}

export async function POST(request: NextRequest) {
  const { userId } = await verifySession();
  const body = await request.json();
  const { name, caloriesPerUnit, category, unitName } = body;

  const food = await prisma.food.create({
    data: {
      name,
      caloriesPerUnit,
      category: category || "custom",
      unitName: unitName || "serving",
      region: "general",
      servingSizes: JSON.stringify([{ label: `1 ${unitName || "serving"}`, multiplier: 1 }]),
      userId,
    },
  });

  return NextResponse.json(food);
}
