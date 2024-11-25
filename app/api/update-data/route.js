import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const newData = req.body;

      // Проверяем входящие данные
      if (!newData || typeof newData !== "object") {
        return res.status(400).json({ message: "Некорректные данные." });
      }

      const filePath = path.join(
        process.cwd(),
        "app",
        "[locale]",
        "(pages)",
        "home",
        "home.json"
      );

      // Читаем текущие данные
      let fileContent;
      try {
        fileContent = await fs.readFile(filePath, "utf-8");
      } catch (err) {
        if (err.code === "ENOENT") {
          // Файл не найден
          return res
            .status(404)
            .json({ message: "Файл данных не найден." });
        }
        throw err;
      }

      const jsonData = JSON.parse(fileContent);

      // Обновляем данные
      jsonData.name = newData.name || jsonData.name;

      // Записываем данные обратно в файл
      await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8");

      return res.status(200).json({ message: "Данные успешно обновлены!" });
    } catch (err) {
      console.error("Ошибка обработки запроса:", err);
      return res
        .status(500)
        .json({ message: "Ошибка сервера. Попробуйте позже." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Метод не поддерживается." });
  }
}
