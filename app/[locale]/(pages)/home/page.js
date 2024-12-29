import Image from "next/image";
import styles from "./home.module.scss";
import { NextResponse } from "next/server";

export const revalidate = 5;

export async function getData() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/malahovskiyoleksandr/malahovskiy/contents/data/database.json`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache", // Запрещаем использование кеша
          // Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Ошибка при получении данных с GitHub" },
        { status: response.status }
      );
    }

    const Data = await response.json();
    const decodedData = JSON.parse(
      Buffer.from(Data.content, "base64").toString("utf-8")
    );
    // Декодирование содержимого файла из base64
    return decodedData;
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка сервера: " + error.message },
      { status: 500 }
    );
  }
}

// export async function getDataPhoto() {
//   try {
//     const response = await fetch(
//       `https://api.github.com/repos/malahovskiyoleksandr/malahovskiy/contents/public/images`,
//       {
//         method: "GET",
//         cache: "no-store",
//         headers: {
//           Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       const text = await response.text(); // Получаем тело ошибки
//       console.error(`Ошибка запроса: ${response.status}`, text);
//       return NextResponse.json(
//         {
//           error: `Ошибка при получении данных с GitHub: ${response.statusText}`,
//         },
//         { status: response.status }
//       );
//     }

//     const data = await response.json();
//     console.log(data)
//     return data;
//   } catch (error) {
//     console.error("Ошибка сервера:", error);
//     return NextResponse.json(
//       { error: `Ошибка сервера: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }

export default async function Home({ params }) {
  const { locale } = params;
  const person = await getData();

  return (
    <>
      <section className={styles.main_block}>
        <div className={styles.container_main}>
          <Image
            className={styles.main_image}
            // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
            // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
            alt="mainImage"
            src={person.home.main_image.src || ""}
            // placeholder="blur" // размытие заднего фона при загрузке картинки
            // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
            quality={100}
            priority={false} // если true - loading = 'lazy' отменяеться
            loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
            fill={false} //заставляет изображение заполнять родительский элемент
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
            sizes="100%"
            width={300} // задать правильное соотношение сторон адаптивного изображения
            height={200}
            style={
              {
                // width: "100%",
                // height: "200px",
                // objectFit: "cover", // Изображение масштабируется, не обрезаясь
                // objectFit: "contain", // Изображение масштабируется, не обрезаясь
                // objectPosition: "top",
              }
            }
          />
          <div className={styles.main_block_description}>
            <h1 className={styles.artist_name}>
              {person?.home?.name?.[locale] || ""}
            </h1>
            <p className={styles.artist_name__description}>
              {person?.home?.description?.[locale] || ""}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
