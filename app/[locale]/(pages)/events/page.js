import styles from "./events.module.scss";
import Link from "next/link";
import Image from "next/image";
import { Spinner } from "@nextui-org/react";
import { NextResponse } from "next/server";

export const metadata = {
  title: "Александр Малаховський. Iвенти",
  description: "Iвенти",
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "google-site-verification": "googlee210a71ad2956609.html",
  },
};


export async function getData() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/malahovskiyoleksandr/DataBase/contents/data/database.json`,
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

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export default async function Events({ params }) {
  const { locale } = await params;
  const database = await getData();
  const events = {
    uk: "Заходи та події",
    en: "Events",
    de: "Veranstaltungen"
  }

  if (!database) {
    return (
      <div className="flex items-center justify-center h-[95vh]">
        <Spinner color="warning" label="Loading" labelColor="warning" />
      </div>
    );
  }

  return (
    <>
      <section className={styles.main_block}>
        <h1 className={styles.zahodu_podii}>{events[locale]}</h1>
        <div
          className={styles.event_list}
        >
          {database?.events &&
            Object.entries(database.events).map(([key, value], index) => (
              <div key={index} className={styles.event}>
                <Link
                  href={`/events/${generateSlug(value.title.en)}`}
                  className={styles.link}
                >
                  <div className={styles.image_box}>
                    {value.main_image ? (
                      <Image
                        className={styles.image}
                        // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                        // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                        alt={value.title[locale]}
                        src={value.main_image}
                        // placeholder="blur" // размытие заднего фона при загрузке картинки
                        // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
                        quality={10} //качество картнки в %
                        priority={true} // если true - loading = 'lazy' отменяеться
                        // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
                        fill={true} //заставляет изображение заполнять родительский элемент
                        // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
                        sizes="100%"
                        // width={300} // задать правильное соотношение сторон адаптивного изображения
                        // height={200}
                        style={
                          {
                            // width: "200px",
                            // height: "200px",
                            // objectFit: "cover", // Изображение масштабируется, обрезая края
                            // objectFit: "contain", // Изображение масштабируется, не обрезаясь
                            // objectPosition: "top",
                            // margin: "0 0 1rem 0",
                          }
                        }
                      />
                    ) : (
                      <Image
                        className={styles.image}
                        // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                        // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                        alt="Main Image"
                        src="https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/default_img.jpg"
                        // placeholder="blur" // размытие заднего фона при загрузке картинки
                        // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
                        quality={10} //качество картнки в %
                        priority={true} // если true - loading = 'lazy' отменяеться
                        // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
                        fill={true} //заставляет изображение заполнять родительский элемент
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        // width={300} // задать правильное соотношение сторон адаптивного изображения
                        // height={200}
                        style={
                          {
                            // width: "200px",
                            // height: "200px",
                            // objectFit: "cover", // Изображение масштабируется, обрезая края
                            // objectFit: "contain", // Изображение масштабируется, не обрезаясь
                            // objectPosition: "top",
                            // margin: "0 0 1rem 0",
                          }
                        }
                      />
                    )}
                  </div>
                  <span className={styles.event_data}>{value.date}</span>
                  <h3 className={styles.event_name}>
                    {value?.title?.[locale] || ""}
                  </h3>
                </Link>
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
export const revalidate = 5;
