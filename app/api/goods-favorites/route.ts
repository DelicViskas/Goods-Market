import { auth } from '@/auth';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getOrderBy } from '@/f';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get("sort") || "";
    const categoryId = searchParams.get('categoryId') || '';
    const search = searchParams.get('search') || '';
    const session = await auth();
    const userId = session?.user?.id;
    const orderBy = getOrderBy(sort);
    const type = searchParams.get('type');

    if (type === 'favorites') {
      const favorites = await prisma.favorites.findMany({
        skip: offset,
        take: limit,
        orderBy:
          { goods: orderBy },
        where: {
          accountId: userId,
        },
        include: {
          goods: {
            select: {
              id: true,
              title: true,
              price: true,
              image: true,
              createdAt: true,
            },
          },
        },
      });

      const mappedFavorites = favorites.map(({ goods, goodsId: id }) => ({
        ...goods,
        id,
        isFavorite: true,
      }));

      return NextResponse.json(mappedFavorites);
    }

    const where = {
      ...(categoryId ? { categoryId: parseInt(categoryId) } : {}),
      ...(search ? {
        title: {
          contains: search,
          mode: Prisma.QueryMode.insensitive
        }
      } : {})
    };

    const goods = await prisma.goods.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy: [
        orderBy,
        { id: 'asc' }
      ],
      include: {
        Favorites: userId ? { where: { accountId: userId } } : false,
      },
    });

    return NextResponse.json(
      goods.map(({ Favorites, ...good }) => ({
        ...good,
        isFavorite: Favorites?.length > 0,
      }))
    );
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return NextResponse.json({ error: "Ошибка загрузки данных" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const goodAndType = await request.json();
    const { type, ...good } = goodAndType;

    if (type === 'goods') {
      const categoryId = parseInt(good.categoryId, 10);

      const goodCreate = await prisma.goods.create({
        data: { ...good, categoryId, accountId: userId, createdAt: new Date },
      });

      return NextResponse.json(goodCreate, { status: 200 });
    }

    if (type === 'favorites') {
      await prisma.favorites.create({
        data: {
          accountId: userId as string,
          goodsId: good.id,
        },
      });

      return NextResponse.json(`Товар успешно добавлен в избранное`, { status: 201 });
    }

    return NextResponse.json({ error: "Некорректный тип данных" }, { status: 400 });
  } catch (error) {
    console.error("Ошибка при добавлении:", error);
    return NextResponse.json({ error: "Ошибка при добавлении" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const { id, type } = await request.json();

    if (type === 'favorites') {
      await prisma.favorites.delete({
        where: {
          accountId_goodsId: {
            accountId: userId as string,
            goodsId: id,
          },
        },
      });

      return NextResponse.json(`Товар успешно удален из избранного`, { status: 201 });
    }

    return NextResponse.json({ error: "Некорректный тип данных" }, { status: 400 });
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    return NextResponse.json({ error: "Ошибка при удалении" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) return NextResponse.json({ error: "Нет доступа" }, { status: 403 })

    const { id, categoryId, ...updatedGood } = await request.json();

    const goodCreate = await prisma.goods.update({
      where: { id },
      data: { ...updatedGood, categoryId: parseInt(categoryId, 10) },
    });

    return NextResponse.json(goodCreate, { status: 200 });

  } catch (error) {
    console.error("Ошибка при добавлении:", error);
    return NextResponse.json({ error: "Ошибка при добавлении" }, { status: 500 });
  }
}
