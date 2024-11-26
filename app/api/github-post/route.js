import fetch from 'node-fetch';

const GITHUB_REPO = 'username/repo';
const GITHUB_FILE_PATH = 'data/events.json';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { newData } = req.body;
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;

    try {
      // Получение текущей информации о файле
      const getResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      });

      if (!getResponse.ok) {
        throw new Error(`GitHub API error: ${getResponse.statusText}`);
      }

      const fileData = await getResponse.json();

      // Обновление файла
      const updatedContent = Buffer.from(JSON.stringify(newData, null, 2)).toString('base64');
      const updateResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update data.json',
          content: updatedContent,
          sha: fileData.sha, // Необходимо для обновления файла
        }),
      });

      if (!updateResponse.ok) {
        throw new Error(`GitHub API error: ${updateResponse.statusText}`);
      }

      res.status(200).json({ message: 'File updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
