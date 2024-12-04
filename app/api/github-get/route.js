import { NextResponse } from "next/server";

// const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const DATA_HOME = "database.json"

export async function GET() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/malahovskiyoleksandr/malahovskiy/contents/data/${DATA_HOME}`,
      {
        method: "GET",
        headers: {
          // "Cache-Control": "no-store",
          // Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка при получении файла с GitHub");
    }

    const Data = await response.json();
    const deCodeData = Buffer.from(Data.content, "base64").toString("utf-8"); // Декодирование содержимого файла из base64
    return NextResponse.json(JSON.parse(deCodeData));
  } catch (error) {
    console.error("Ошибка:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
