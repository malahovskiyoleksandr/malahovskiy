// // app/api/get-data/route.js
// import fs from "fs";
// import path from "path";

// export async function GET(req) {
//   try {
    // const filePath = path.join(
    //   process.cwd(),
    //   "app",
    //   "[locale]",
    //   "(pages)",
    //   "home",
    //   "home.json"
    // ); // Путь к файлу
//     const fileData = fs.readFileSync(filePath, "utf-8"); // Читаем файл
//     const data = JSON.parse(fileData); // Парсим данные

//     return new Response(JSON.stringify(data), { status: 200 });
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ message: "Ошибка при чтении данных." }),
//       { status: 500 }
//     );
//   }
// }

// pages/api/getData.js
import fs from 'fs';
import path from 'path';

export async function getData() {
  const filePath = path.join(
    process.cwd(),
    "app",
    "[locale]",
    "(pages)",
    "home",
    "home.json"
  );
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export default async function handler(req, res) {
  const data = await getData();
  res.status(200).json(data);
}

