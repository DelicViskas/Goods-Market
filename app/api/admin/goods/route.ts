import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  try {
    const goods = await prisma.goods.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        image: true,
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },

        account: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        id: 'asc'
      }
    });
    return NextResponse.json(goods.map(({ category, account, ...good }) => ({ ...good, category: category.name, account: account.name })))
  } catch {
    return NextResponse.json({ error: "Ошибка при получении товаров" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const { title, price, description, category, image, account } = await request.json();
  console.log(title, price, description, category, image, account);
  try {
    const good = await prisma.goods.create({
      data: {
        title,
        price: parseInt(price),
        description,
        categoryId: parseInt(category, 10),
        image: [image || ''],
        createdAt: new Date,
        accountId: account,
      },
    });
    console.log(good);

    return NextResponse.json(good);
  } catch {
    return NextResponse.json({ error: "Ошибка при создании товара" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }
  const id = (await request.json()).id;

  try {
    const good = await prisma.goods.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(good);
  } catch {
    return NextResponse.json({ error: "Ошибка при удалении товара" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  const { id, title, price, description, category } = await request.json();

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }


  try {
    const objCategory = await prisma.categories.findFirst({
      where: {
        name: category
      }
    });

    const good = await prisma.goods.update({
      where: { id: parseInt(id) },
      data: { title, price: Number(price), description, categoryId: objCategory?.id },
    });
    return NextResponse.json(good);
  } catch {
    return NextResponse.json({ error: "Ошибка при обновлении товара" }, { status: 500 });
  }
}