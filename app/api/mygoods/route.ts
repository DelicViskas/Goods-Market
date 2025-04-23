import { auth } from '@/auth';
import { prisma } from '@/prisma/prisma';

import { type NextRequest, NextResponse } from 'next/server'



export async function GET(/* request: NextRequest */) {
  try {
    const session = await auth();

    if (!session?.user) return NextResponse.json(null);
    const
      goods = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        include: {
          Goods: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });

    return NextResponse.json(goods?.Goods);

  } catch (error) {
    console.error("Ошибка при добвалении обявления:", error);
    return NextResponse.json({ error: "Ошибка при добвалении обявления" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = (await request.json()).id
    await prisma.goods.delete({
      where: {
        id
      }
    })

    return NextResponse.json(`Товар успешно удален `, { status: 201 });
  } catch (error) {
    console.error("Ошибка при удалении из избранного:", error);
    return NextResponse.json({ error: "Ошибка при удалении" }, { status: 500 });
  }
}