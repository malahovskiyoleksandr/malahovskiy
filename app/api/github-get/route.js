import { NextResponse } from "next/server";

// const GITHUB_REPO = "malahovskiyoleksandr/malahovskiy"; // Основной репозиторий
const GITHUB_REPO = "malahovskiyoleksandr/DataBase"; // Основной репозиторий

export async function GET() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/data/database.json`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Cache-Control": "no-cache", // Запрещаем использование кеша
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Ошибка при получении данных с GitHub" },
        { status: response.status },
        { statusText: response.statusText }
      );
    }

    const Data = await response.json();
    // console.log(Data)
    const decodedData = JSON.parse(
      Buffer.from(Data.content, "base64").toString("utf-8")
    );
    // Декодирование содержимого файла из base64
    return NextResponse.json(decodedData);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка сервера: " + error.message },
      { status: 500 }
    );
  }
}
