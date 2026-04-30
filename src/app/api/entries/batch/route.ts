import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { getEntriesByDates } from "@/lib/dal";

export async function GET(request: NextRequest) {
  const { userId } = await verifySession();
  const dates = request.nextUrl.searchParams.get("dates") || "";
  const dateList = dates.split(",").filter(Boolean);

  if (dateList.length === 0) {
    return NextResponse.json({});
  }

  const grouped = await getEntriesByDates(userId, dateList);
  return NextResponse.json(grouped);
}
