// // app/api/update-data/route.js
// import fs from 'fs';
// import path from 'path';

// export async function POST(req) {
//   try {
//     const newData = await req.json();  // Получаем данные из запроса
//     const filePath = path.join(process.cwd(), 'public', 'home', 'home.json');  // Путь к файлу

//     // Записываем новые данные в JSON файл
//     fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));

//     return new Response(JSON.stringify({ message: 'Данные успешно обновлены!' }), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ message: 'Ошибка при обновлении данных.' }), { status: 500 });
//   }
// }

import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const newData = await req.json(); // Получаем данные из запроса
    const filePath = path.join(
      process.cwd(),
      "app",
      "[locale]",
      "(pages)",
      "home",
      "home.json"
    ); // Путь к файлу

    // Читаем текущий JSON файл
    const fileContent = await fs.readFile(filePath, "utf-8");
    let jsonData = JSON.parse(fileContent);

    // Обновляем данные
    jsonData = { ...jsonData, ...newData };

    // Сохраняем обновленные данные
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8");

    // Возвращаем успешный ответ
    return new Response(
      JSON.stringify({ message: "Данные успешно обновлены!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка:", error);
    return new Response(
      JSON.stringify({ message: "Ошибка при обновлении данных." }),
      { status: 500 }
    );
  }
}


// import fs from "fs";
// import path from "path";

// export default function handler(req, res) {
//   if (req.method === "POST") {
//     const newData = req.body; // Получаем данные из запроса
//     console.log(newData);

//     const filePath = path.join(process.cwd(), "public", "home", "home.json"); // Путь к файлу

//     // Читаем текущие данные из файла
//     fs.readFile(filePath, "utf-8", (err, data) => {
//       if (err) {
//         console.error("Ошибка чтения файла:", err);
//         return res.status(500).json({ message: "Ошибка при чтении данных." });
//       }

//       // Преобразуем текущие данные в объект
//       let jsonData = JSON.parse(data);

//       // Обновляем поле name
//       jsonData.name = newData.name || jsonData.name; // Если в запросе есть новое имя, обновляем его

//       // Записываем измененные данные обратно в файл
//       fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
//         if (err) {
//           console.error("Ошибка записи данных в файл:", err);
//           return res
//             .status(500)
//             .json({ message: "Ошибка при сохранении данных." });
//         }

//         return res.status(200).json({ message: "Данные успешно обновлены!" });
//       });
//     });
//   } else {
//     return res.status(405).json({ message: "Метод не поддерживается" });
//   }
// }
