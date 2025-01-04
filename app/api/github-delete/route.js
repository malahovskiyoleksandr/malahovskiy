import { NextResponse } from "next/server";

const GITHUB_REPO = "malahovskiyoleksandr/malahovskiy"; // Основной репозиторий
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Ваш токен

export async function POST(req) {
  try {
    const { filePath } = await req.json();

    if (!filePath) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
    let fileSHA = null;

    // Получаем SHA файла для его удаления
    const getResponse = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    if (getResponse.ok) {
      const fileData = await getResponse.json();
      fileSHA = fileData.sha;
    } else if (getResponse.status === 404) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    } else {
      throw new Error("Ошибка при проверке файла в репозитории");
    }

    // Удаляем файл из репозитория
    const deleteResponse = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Удаление файла: ${filePath}`,
        sha: fileSHA,
      }),
    });

    if (!deleteResponse.ok) {
      throw new Error("Ошибка удаления файла из репозитория");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка API удаления:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
