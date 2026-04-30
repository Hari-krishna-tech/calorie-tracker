import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { getUserWeights } from "@/lib/dal";

export async function GET() {
  const { userId } = await verifySession();
  const weights = await getUserWeights(userId);
  return NextResponse.json(weights);
}

export async function POST(request: NextRequest) {
  const { userId } = await verifySession();
  const { weight, date } = await request.json();
  const entry = await prisma.weightEntry.upsert({
    where: { userId_date: { userId, date } },
    update: { weight },
    create: { weight, date, userId },
  });
  return NextResponse.json(entry);
}
