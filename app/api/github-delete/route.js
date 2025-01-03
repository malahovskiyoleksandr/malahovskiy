import { NextResponse } from "next/server";

const GITHUB_REPO = "malahovskiyoleksandr/malahovskiy";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function POST(request) {
  try {
    const { filePath, commitMessage } = await request.json();

    if (!filePath || !commitMessage) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;

    // Получаем SHA файла
    const getResponse = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    if (!getResponse.ok) {
      if (getResponse.status === 404) {
        return NextResponse.json({ error: "Файл не найден в репозитории" }, { status: 404 });
      }
      throw new Error(`Ошибка проверки файла: ${getResponse.statusText}`);
    }

    const fileData = await getResponse.json();
    const fileSHA = fileData.sha;

    // Удаляем файл
    const deleteResponse = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        sha: fileSHA,
      }),
    });

    if (!deleteResponse.ok) {
      throw new Error(`Ошибка удаления файла: ${deleteResponse.statusText}`);
    }

    return NextResponse.json({ success: true, message: "Файл успешно удален" });
  } catch (error) {
    console.error("Ошибка API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
