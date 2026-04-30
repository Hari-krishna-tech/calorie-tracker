import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { verifySession, getSession } from "@/lib/session";

export const getEntriesByDate = cache(async (userId: string, date: string) => {
  return prisma.foodEntry.findMany({
    where: { userId, date },
    include: { food: true },
    orderBy: { createdAt: "asc" },
  });
});

export const getEntriesByDates = cache(async (userId: string, dates: string[]) => {
  const entries = await prisma.foodEntry.findMany({
    where: { userId, date: { in: dates } },
    include: { food: true },
    orderBy: { createdAt: "asc" },
  });
  const grouped: Record<string, typeof entries> = {};
  for (const e of entries) {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  }
  return grouped;
});

export const getUserSettings = cache(async (userId: string) => {
  const existing = await prisma.settings.findFirst({ where: { userId } });
  if (existing) return existing;
  return prisma.settings.create({ data: { userId, dailyCalorieGoal: 2000 } });
});

export const searchFoods = cache(async (query: string, userId: string | null, limit: number) => {
  return prisma.food.findMany({
    where: {
      name: { contains: query },
      OR: [
        { userId: null },
        ...(userId ? [{ userId }] : []),
      ],
    },
    take: limit,
    orderBy: [{ isCommon: "desc" }, { name: "asc" }],
  });
});

export const getUserWeights = cache(async (userId: string) => {
  return prisma.weightEntry.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });
});
