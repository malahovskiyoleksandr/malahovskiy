import fetch from 'node-fetch';

const GITHUB_REPO = 'malahovskiyoleksandr/malahovskiy';
const GITHUB_FILE_PATH = 'data/home.json';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Создайте токен с доступом к репозиторию

export default async function handler(req, res) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const fileData = await response.json();
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');

    res.status(200).json(JSON.parse(content));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
