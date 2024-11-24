import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const newData = req.body; // Получаем данные из запроса
    const filePath = path.join(
      process.cwd(),
      "app",
      "[locale]",
      "(pages)",
      "home",
      "home.json"
    );
    
    // Читаем текущие данные из файла
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error("Ошибка чтения файла:", err);
        return res.status(500).json({ message: "Ошибка при чтении данных." });
      }

      // Преобразуем текущие данные в объект
      let jsonData = JSON.parse(data);

      // Обновляем поле name
      jsonData.name = newData.name || jsonData.name; // Если в запросе есть новое имя, обновляем его

      // Записываем измененные данные обратно в файл
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error("Ошибка записи данных в файл:", err);
          return res
            .status(500)
            .json({ message: "Ошибка при сохранении данных." });
        }

        return res.status(200).json({ message: "Данные успешно обновлены!" });
      });
    });
  } else {
    return res.status(405).json({ message: "Метод не поддерживается" });
  }
}
