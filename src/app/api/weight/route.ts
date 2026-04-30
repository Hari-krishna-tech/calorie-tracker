import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const weights = await prisma.weightEntry.findMany({
    orderBy: { date: "asc" },
  });
  return NextResponse.json(weights);
}

export async function POST(request: NextRequest) {
  const { weight, date } = await request.json();
  const entry = await prisma.weightEntry.upsert({
    where: { date },
    update: { weight },
    create: { weight, date },
  });
  return NextResponse.json(entry);
}
