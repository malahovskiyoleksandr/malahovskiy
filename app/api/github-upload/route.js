import { NextResponse } from "next/server";

const GITHUB_REPO = "DataBase"; // Основной репозиторий
const GITHUB_OWNER = "malahovskiyoleksandr"; // Ваш GitHub логин
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Токен GitHub

export async function POST(req) {
  try {
    const { fileName, fileContent } = await req.json();

    if (!fileName || !fileContent) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${fileName}`;
    const commitMessage = `Добавление файла: ${fileName}`;
    let fileSHA = null;

    // Проверяем, существует ли файл
    const getResponse = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    if (getResponse.ok) {
      const fileData = await getResponse.json();
      fileSHA = fileData.sha; // Получаем SHA существующего файла
    } else if (getResponse.status !== 404) {
      throw new Error("Ошибка проверки файла на GitHub");
    }

    // Отправляем запрос на обновление или создание файла
    const putResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: fileContent,
        sha: fileSHA || undefined, // SHA добавляется, если файл существует
      }),
    });

    if (!putResponse.ok) {
      throw new Error("Ошибка загрузки файла на GitHub");
    }

    const result = await putResponse.json();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Ошибка API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
