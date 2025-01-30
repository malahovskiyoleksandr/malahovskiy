import fetch from "node-fetch";

const GITHUB_API_URL = "https://api.github.com";
const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_FILE_PATH, GITHUB_BRANCH } = process.env;

// 📌 Функция загрузки JSON-файла с GitHub
export async function getJsonData() {
  const url = `${GITHUB_API_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` },
  });

  if (!res.ok) throw new Error("Ошибка при загрузке JSON-файла");

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");

  return { json: JSON.parse(content), sha: data.sha };
}

// 📌 Функция сохранения JSON обратно в GitHub
export async function saveJsonData(updatedJson, sha) {
  const url = `${GITHUB_API_URL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
  const content = Buffer.from(JSON.stringify(updatedJson, null, 2)).toString("base64");

  const res = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Обновление данных пользователей",
      content,
      sha,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!res.ok) throw new Error("Ошибка при сохранении JSON-файла");
}
