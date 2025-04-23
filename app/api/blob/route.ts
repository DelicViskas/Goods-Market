import { del, list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  try {
    let id = 0;
    const data = await list();
    const blobs = data.blobs.map(blobs => { return { ...blobs, id: id++ } })
    return NextResponse.json(blobs);
  } catch (error) {
    console.error("Ошибка получения blob-ов:", error);
    return NextResponse.json({ error: "Ошибка получения blob-ов" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get("image") as File;
  if (!image) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
  }

  const blob = await put(`goods/${image.name}`, image, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  });

  return NextResponse.json(blob.url);
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  try {
    const { id: url } = await request.json();

    await del(url);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка при удалении blob:", error);
    return NextResponse.json({ error: "Ошибка при удалении blob" }, { status: 500 });
  }
}
