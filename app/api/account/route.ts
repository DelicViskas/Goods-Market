import { auth } from "@/auth";
import { getAverageRating, hashPassword } from "@/f";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from 'crypto';
import { sendVerificationEmail } from "@/email";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Вход не выполнен" }, { status: 403 });
  const id = session.user?.id

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        receivedReviews: true
      }
    })
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    const { receivedReviews, ...userData } = user;
    return NextResponse.json({ ...userData, reviews: getAverageRating(receivedReviews), reviewslength: receivedReviews.length });

  } catch {
    return NextResponse.json({ error: "Ошибка при получении пользователя" }, { status: 500 });
  }
}


export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) return NextResponse.json({ error: "Нет доступа" }, { status: 403 })

    const id = session.user.id
    const req = await request.json();

    if (req.name && id) {
      const userName = await prisma.user.update({
        where: { id },
        data: { name: req.name }
      })

      return NextResponse.json(userName);
    }


    if (req.image && id) {

      const userName = await prisma.user.update({
        where: { id },
        data: { image: req.image }
      })
      return NextResponse.json(userName);
    }

  } catch (error) {
    console.error("Ошибка при добавлении:", error);
    return NextResponse.json({ error: "Ошибка при добавлении" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    const token = randomUUID()

    await sendVerificationEmail(email, token);

    const user = await prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
        name,
        verificationToken: token,
        emailVerified: null
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    return NextResponse.json({ error: "Ошибка при регистрации" }, { status: 500 });
  }
}