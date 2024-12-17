import { NextResponse } from "next/server";

const GITHUB_REPO = "malahovskiyoleksandr/malahovskiy";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function POST(request) {
  try {
    const { filePath, fileContent, commitMessage } = await request.json();

    if (!filePath || !fileContent || !commitMessage) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
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
      fileSHA = fileData.sha;
    } else if (getResponse.status !== 404) {
      throw new Error("Ошибка проверки файла на GitHub");
    }

    // Кодируем файл в Base64
    const encodedContent = Buffer.from(fileContent).toString("base64");

    // Обновляем или создаем файл
    const putResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: encodedContent,
        sha: fileSHA || undefined,
      }),
    });

    if (!putResponse.ok) {
      throw new Error("Ошибка при обновлении файла на GitHub");
    }

    const result = await putResponse.json();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Ошибка API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
