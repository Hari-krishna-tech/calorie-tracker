import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const foods = await prisma.food.findMany({
    where: {
      name: { contains: q },
    },
    take: 15,
    orderBy: [{ isCommon: "desc" }, { name: "asc" }],
  });
  return NextResponse.json(foods);
}
