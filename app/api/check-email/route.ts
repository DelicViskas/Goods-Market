import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) return NextResponse.json(false);

  const user = await prisma.user.findUnique({ where: { email } });
  return NextResponse.json(!!user);
}