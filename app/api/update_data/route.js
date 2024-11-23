// import fs from "fs";
// import path from "path";

// export default function handler(req, res) {
//   const filePath = path.join(
//     process.cwd(),
//     // "app",
//     "[locale]",
//     "(pages)",
//     "home",
//     "home.json"
//     );
//     console.log(filePath)
//   if (req.method === "POST") {
//       const newData = req.body;

//     // Записываем новые данные в файл
//     fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
//       if (err) {
//         console.error(err);
//         return res
//           .status(500)
//           .json({ message: "Ошибка при сохранении данных" });
//       }

//       res.status(200).json({ message: "Данные успешно обновлены" });
//     });
//   } else {
//     res.status(405).json({ message: "Метод не поддерживается" });
//   }
// }


// pages/api/update-data.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const newData = req.body;  // Получаем данные из запроса
      const filePath = path.join(process.cwd(), 'public', 'home', 'home.json');  // Путь к файлу
    //   console.log(filePath)

    // Записываем новые данные в JSON файл
    fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
      if (err) {
        console.error('Ошибка записи данных в файл:', err);
        return res.status(500).json({ message: 'Ошибка при сохранении данных.' });
      }

      return res.status(200).json({ message: 'Данные успешно обновлены!' });
    });
  } else {
    return res.status(405).json({ message: 'Метод не поддерживается' });
  }
}
