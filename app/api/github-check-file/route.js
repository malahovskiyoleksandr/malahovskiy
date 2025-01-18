import { NextResponse } from "next/server";

const GITHUB_REPO = "malahovskiyoleksandr/DataBase"; // Основной репозиторий
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Ваш токен

export async function POST(req) {
  try {
    const { filePath } = await req.json();

    if (!filePath) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;

    const getResponse = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    if (getResponse.status === 404) {
      return NextResponse.json({ exists: false });
    }

    if (!getResponse.ok) {
      throw new Error("Ошибка при проверке файла");
    }

    return NextResponse.json({ exists: true });
  } catch (error) {
    console.error("Ошибка API проверки файла:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
