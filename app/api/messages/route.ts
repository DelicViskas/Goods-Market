import { auth } from '@/auth';
import { prisma } from '@/prisma/prisma';
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const session = await auth();
    const userId = session?.user?.id

    if (type === 'chat') {
      if (!userId || !id) {
        return NextResponse.json({ error: "Пользователь не найден" }, { status: 400 });
      }

      const partner = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          image: true,
        }
      });

      const messages = await prisma.messages.findMany({
        where: {
          OR: [
            { sender_ms: userId, receiver_ms: id },
            { sender_ms: id, receiver_ms: userId },
          ]
        },
        orderBy: {
          createdAt: 'asc'
        }
      })

      return NextResponse.json({ messages, partner });
    }

    if (!type) {
      const messages = await prisma.messages.findMany({
        where: {
          OR: [
            { receiver_ms: userId },
            { sender_ms: userId },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const latestMessagesByPartner = new Map<string, typeof messages[0]>();

      for (const msg of messages) {
        const isSender = msg.sender_ms === userId;
        const partnerId = isSender ? msg.receiver_ms : msg.sender_ms;

        if (!latestMessagesByPartner.has(partnerId)) {
          latestMessagesByPartner.set(partnerId, msg);
        }
      }

      const flatMessages = Array.from(latestMessagesByPartner.values()).map(msg => {
        const isSender = msg.sender_ms === userId;
        const partner = isSender ? msg.receiver : msg.sender;

        return {
          text: msg.text,
          createdAt: msg.createdAt,
          partnerId: partner.id,
          partnerName: partner.name,
          partnerImage: partner.image,
        };
      });

      return NextResponse.json(flatMessages);
    }
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return NextResponse.json({ error: "Ошибка загрузки данных" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sender_ms, receiver_ms, text, createdAt } = await request.json();

    const messageCreate = await prisma.messages.create({
      data: { sender_ms, receiver_ms, text, createdAt },
    });

    return NextResponse.json(messageCreate, { status: 200 });

  } catch (error) {
    console.error("Ошибка при создании сообщения:", error);
    return NextResponse.json({ error: "Ошибка при создании сообщения" }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const { userId, partnerId } = await request.json();

    await prisma.messages.deleteMany({
      where: {
        OR: [
          {
            sender_ms: userId,
            receiver_ms: partnerId
          },
          {
            sender_ms: partnerId,
            receiver_ms: userId
          }
        ]
      }
    })

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Ошибка при удалении сообщений:', error);
    return NextResponse.json({ error: 'Ошибка при удалении сообщений' }, { status: 500 });
  }
}