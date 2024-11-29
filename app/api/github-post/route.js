import { NextResponse } from "next/server";

const GITHUB_REPO = "malahovskiyoleksandr/malahovskiy";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function POST(request) {
  console.log(request)
  try {
    const { filePath, fileContent, commitMessage } = await request.json();

    if (!filePath || !fileContent || !commitMessage) {
      return NextResponse.json({ error: "Invalid request data (API)" }, { status: 400 });
    }

    // Проверяем, существует ли файл
    const getFileUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
    let fileSHA = null;

    const getResponse = await fetch(getFileUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    if (getResponse.ok) {
      const fileData = await getResponse.json();
      fileSHA = fileData.sha;
    } else if (getResponse.status !== 404) {
      throw new Error("Ошибка при проверке существования файла.");
    }

    // Кодируем содержимое файла в Base64
    const fileContentBase64 = Buffer.from(fileContent).toString("base64");

    // Загружаем или обновляем файл
    const putResponse = await fetch(getFileUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: fileContentBase64,
        sha: fileSHA || undefined,
      }),
    });

    if (!putResponse.ok) {
      throw new Error("Ошибка при загрузке файла.(API)");
    }

    const result = await putResponse.json();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("(API)Ошибка:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
