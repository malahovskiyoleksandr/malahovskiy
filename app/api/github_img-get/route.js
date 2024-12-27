// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const response = await fetch(
//       `https://api.github.com/repos/malahovskiyoleksandr/malahovskiy/contents/public`,
//       {
//         method: "GET",
//         cache: "no-store",
//         headers: {
//           Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
//           Accept: "application/vnd.github.v3+json", // Указываем версию API
//         },
//       }
//     );

//     if (!response.ok) {
//       const text = await response.text(); // Получаем тело ошибки
//       console.error(`Ошибка запроса: ${response.status}`, text);
//       return NextResponse.json(
//         { error: `Ошибка при получении данных с GitHub: ${response.statusText}` },
//         { status: response.status }
//       );
//     }

//     // Логируем весь ответ
//     // console.log("Response:", response);

//     const data = await response.json();
//     console.log("data", data)

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Ошибка сервера:", error);
//     return NextResponse.json(
//       { error: `Ошибка сервера: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }


