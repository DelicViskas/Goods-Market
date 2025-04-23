import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.categories.findMany();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Ошибка при получении категорий" }, { status: 500 });
  }
}