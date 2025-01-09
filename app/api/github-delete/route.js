import { NextResponse } from "next/server";

// const GITHUB_REPO = "malahovskiyoleksandr/malahovskiy"; // Основной репозиторий
const GITHUB_REPO = "malahovskiyoleksandr/DataBase"; // Основной репозиторий
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Ваш токен

export async function POST(req) {
  try {
    const { filePath, isDirectory } = await req.json();

    if (!filePath) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
    console.log(`Processing ${isDirectory ? "directory" : "file"} at: ${filePath}`);

    if (isDirectory) {
      // Получаем список файлов в директории
      const getResponse = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      });

      if (getResponse.status === 404) {
        return NextResponse.json({ error: "Directory not found" }, { status: 404 });
      }

      if (!getResponse.ok) {
        throw new Error(`Ошибка получения содержимого директории: ${getResponse.statusText}`);
      }

      const files = await getResponse.json();

      if (!Array.isArray(files)) {
        return NextResponse.json({ error: "Not a directory" }, { status: 400 });
      }

      console.log(`Deleting ${files.length} files from directory: ${filePath}`);
      // Удаляем каждый файл в директории
      for (const file of files) {
        const deleteResponse = await fetch(file.url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Удаление файла ${file.name}`,
            sha: file.sha,
          }),
        });

        if (!deleteResponse.ok) {
          console.error(`Ошибка удаления файла ${file.name}: ${deleteResponse.statusText}`);
        }
      }

      return NextResponse.json({ success: true, message: "Directory deleted" });
    } else {
      // Удаляем один файл
      const getResponse = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      });

      if (getResponse.status === 404) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      if (!getResponse.ok) {
        throw new Error(`Ошибка при проверке файла: ${getResponse.statusText}`);
      }

      const fileData = await getResponse.json();
      const fileSHA = fileData.sha;

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
        throw new Error(`Ошибка удаления файла: ${deleteResponse.statusText}`);
      }

      return NextResponse.json({ success: true, message: "File deleted" });
    }
  } catch (error) {
    console.error("Ошибка API удаления:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
