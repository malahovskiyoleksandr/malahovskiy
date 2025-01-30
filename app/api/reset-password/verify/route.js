import { db } from '@/lib/database';
import { NextResponse } from "next/server";

export async function getData() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/malahovskiyoleksandr/DataBase/contents/data/database.json`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache", // Запрещаем использование кеша
          // Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Ошибка при получении данных с GitHub" },
        { status: response.status }
      );
    }

    const Data = await response.json();
    const decodedData = JSON.parse(
      Buffer.from(Data.content, "base64").toString("utf-8")
    );
    // Декодирование содержимого файла из base64
    return decodedData;
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка сервера: " + error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { token } = await req.json();
    const db = await getData()

    const resetRequest = await db.passwordReset.findUnique({ where: { token } });

    if (!resetRequest || resetRequest.expires < new Date()) {
      return new Response(JSON.stringify({ error: 'Недействительный или истёкший токен' }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: 'Токен валиден', email: resetRequest.email }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Ошибка сервера' }), { status: 500 });
  }
}
