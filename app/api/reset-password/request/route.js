import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { NextResponse } from "next/server";
// import { db } from '@/lib/database'; // Подключение к БД

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
    const { email } = await req.json();
    const db = await getData()
    console.log("db", db)
    // Проверяем, существует ли пользователь
    const user = await db.users.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Пользователь не найден' }), { status: 404 });
    }

    // Генерируем токен и срок действия (1 час)
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 час

    // Сохраняем токен в базе
    await db.passwordReset.create({
      data: { email, token, expires },
    });

    // Формируем ссылку
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // Отправляем письмо
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Malahovskiy" malahovskiy@gmail.com',
      to: email,
      subject: 'Восстановление пароля',
      html: `<p>Для сброса пароля перейдите по <a href="${resetLink}">этой ссылке</a>. Срок действия — 1 час.</p>`,
    });

    return new Response(JSON.stringify({ message: 'Ссылка отправлена' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Ошибка сервера' }), { status: 500 });
  }
}
