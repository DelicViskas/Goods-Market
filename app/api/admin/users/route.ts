import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Ошибка при получении пользователей" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const { email, name, role } = await request.json();
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
      },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Ошибка при создании пользователя" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const { email, name, role, id } = await request.json();

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { email, name, role },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Ошибка при обновлении пользователя" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  const id = (await request.json()).id;
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  try {
    const user = await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Ошибка при удалении пользователя" }, { status: 500 });
  }
}


