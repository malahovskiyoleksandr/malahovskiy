import bcrypt from 'bcryptjs';
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
    const { token, newPassword } = await req.json();
    const db = await getData()
    
    // Проверяем токен
    const resetRequest = await db.passwordReset.findUnique({ where: { token } });
    if (!resetRequest || resetRequest.expires < new Date()) {
      return new Response(JSON.stringify({ error: 'Недействительный или истёкший токен' }), { status: 400 });
    }

    // Хэшируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновляем пароль пользователя
    await db.user.update({
      where: { email: resetRequest.email },
      data: { password: hashedPassword },
    });

    // Удаляем использованный токен
    await db.passwordReset.delete({ where: { token } });

    return new Response(JSON.stringify({ message: 'Пароль успешно обновлён' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Ошибка сервера' }), { status: 500 });
  }
}
