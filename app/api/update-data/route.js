// import fs from "fs/promises";
// import path from "path";

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const newData = req.body;

//       // Проверяем входящие данные
//       if (!newData || typeof newData !== "object") {
//         return res.status(400).json({ message: "Некорректные данные." });
//       }

      // const filePath = path.join(
      //   process.cwd(),
      //   "public",
      //   "home",
      //   "home.json"
      // );

//       // Читаем текущие данные
//       let fileContent;
//       try {
//         fileContent = await fs.readFile(filePath, "utf-8");
//       } catch (err) {
//         if (err.code === "ENOENT") {
//           // Файл не найден
//           return res
//             .status(404)
//             .json({ message: "Файл данных не найден." });
//         }
//         throw err;
//       }

//       const jsonData = JSON.parse(fileContent);

//       // Обновляем данные
//       jsonData.name = newData.name || jsonData.name;

//       // Записываем данные обратно в файл
//       await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf-8");

//       return res.status(200).json({ message: "Данные успешно обновлены!" });
//     } catch (err) {
//       console.error("Ошибка обработки запроса:", err);
//       return res
//         .status(500)
//         .json({ message: "Ошибка сервера. Попробуйте позже." });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     return res.status(405).json({ message: "Метод не поддерживается." });
//   }
// }


import fs from "fs";
import path from "path";

// Обработчик POST-запроса
export async function POST(req) {
  try {
    const body = await req.json(); // Получаем данные из запроса
    const filePath = path.join(
      process.cwd(),
      "public",
      "home",
      "home.json"
    );

    // Чтение текущих данных
    const fileData = await fs.promises.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileData);

    // Обновление данных
    const updatedData = { ...jsonData, ...body };

    // Запись обновленных данных
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(updatedData, null, 2),
      "utf-8"
    );

    return new Response(
      JSON.stringify({ message: "Данные успешно обновлены!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    return new Response(
      JSON.stringify({ message: "Ошибка при сохранении данных." }),
      { status: 500 }
    );
  }
}
