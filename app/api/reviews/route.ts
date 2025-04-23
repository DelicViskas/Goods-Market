import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get('receiver');
    const session = await auth();

    if (!session?.user) return NextResponse.json(null);

    if (receiverId) {
      const existingReview = await prisma.reviews.findFirst({
        where: {
          sender_rw: session.user.id,
          receiver_rw: receiverId,
        },
      });

      return NextResponse.json(!!existingReview);
    } else {
      const
        reviews = await prisma.reviews.findMany({
          where: {
            receiver_rw: session.user.id
          },
          include: {
            sender: {
              select: {
                name: true,
                image: true,
              }
            }
          }
        });

      return NextResponse.json(reviews);
    }

  } catch (error) {
    console.error("Ошибка при добвалении обявления:", error);
    return NextResponse.json({ error: "Ошибка при добвалении обявления" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sender_rw, receiver_rw, comment, rating } = await request.json();

    const reviewCreate = await prisma.reviews.create({
      data: { sender_rw, receiver_rw, comment, rating },
    });

    return NextResponse.json(reviewCreate, { status: 200 });

  } catch (error) {
    console.error("Ошибка при создании отзыва:", error);
    return NextResponse.json({ error: "Ошибка при создании отзыва" }, { status: 500 });
  }
}