// import { NextResponse } from "next/server";

// const GITHUB_REPO = "malahovskiyoleksandr/malahovskiy";
// const GITHUB_REPORAR = "malahovskiyoleksandr/DB";
// const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// export async function POST(request) {
//   try {
//     const { filePath, fileContent, commitMessage } = await request.json();

//     if (!filePath || !fileContent || !commitMessage) {
//       return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
//     }

//     const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
//     const urlRAR = `https://api.github.com/repos/${GITHUB_REPORAR}/contents/${filePath}`;
//     let fileSHA = null;

//     // Проверяем, существует ли файл
//     const getResponse = await fetch(url, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${GITHUB_TOKEN}`,
//       },
//     });

//     if (getResponse.ok) {
//       const fileData = await getResponse.json();
//       fileSHA = fileData.sha;
//     } else if (getResponse.status !== 404) {
//       throw new Error("Ошибка проверки файла на GitHub");
//     }

//     // Кодируем файл в Base64
//     const encodedContent = Buffer.from(fileContent).toString("base64");

//     // Обновляем или создаем файл
//     const putResponse = await fetch(url, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${GITHUB_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message: commitMessage,
//         content: encodedContent,
//         sha: fileSHA || undefined,
//       }),
//     });

//     if (!putResponse.ok) {
//       throw new Error("Ошибка при обновлении файла на GitHub");
//     }

//     const result = await putResponse.json();
//     return NextResponse.json({ success: true, result });
//   } catch (error) {
//     console.error("Ошибка API:", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";

const GITHUB_REPO = "malahovskiyoleksandr/malahovskiy";
const GITHUB_REPORAR = "malahovskiyoleksandr/DB";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function POST(request) {
  try {
    const { filePath, fileContent, commitMessage } = await request.json();

    if (!filePath || !fileContent || !commitMessage) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Функция для обновления или создания файла в указанном репозитории
    const updateFileInRepo = async (repo, path, content, message) => {
      const url = `https://api.github.com/repos/${repo}/contents/${path}`;
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
        throw new Error(`Ошибка проверки файла в репозитории ${repo}`);
      }

      // Обновляем или создаем файл
      const putResponse = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          content: content,
          sha: fileSHA || undefined,
        }),
      });

      if (!putResponse.ok) {
        const errorText = await putResponse.text();
        throw new Error(
          `Ошибка обновления файла в репозитории ${repo}: ${errorText}`
        );
      }

      return putResponse.json();
    };

    // Кодируем файл в Base64
    const encodedContent = Buffer.from(fileContent).toString("base64");

    // Обновляем основной репозиторий
    const mainRepoResult = await updateFileInRepo(
      GITHUB_REPO,
      filePath,
      encodedContent,
      commitMessage
    );

    // Пытаемся обновить резервный репозиторий
    try {
      await updateFileInRepo(
        GITHUB_REPORAR,
        filePath,
        encodedContent,
        `Backup: ${commitMessage}`
      );
    } catch (backupError) {
      console.error(
        "Ошибка при обновлении резервного репозитория:",
        backupError.message
      );
      // Логируем, но не прерываем выполнение
    }

    return NextResponse.json({ success: true, result: mainRepoResult });
  } catch (error) {
    console.error("Ошибка API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
