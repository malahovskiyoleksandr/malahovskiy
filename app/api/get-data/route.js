// app/api/get-data/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req) {
  try {
    const filePath = path.join(
      process.cwd(),
      "app",
      "[locale]",
      "(pages)",
      "home",
      "home.json"
    ); // Путь к файлу
    const fileData = fs.readFileSync(filePath, "utf-8"); // Читаем файл
    const data = JSON.parse(fileData); // Парсим данные
    console.log(data)

    // return new Response(JSON.stringify(data), { status: 200 });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    // return new Response(
    //   JSON.stringify({ message: "Ошибка при чтении данных." }),
    //   { status: 500 }
    // );
    return NextResponse.json(
      { message: "Ошибка при получении данных." },
      { status: 500 }
    );
  }
}