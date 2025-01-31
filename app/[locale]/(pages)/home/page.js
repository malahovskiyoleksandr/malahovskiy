import Image from "next/image";
import styles from "./home.module.scss";
import { NextResponse } from "next/server";
import { Spinner } from "@nextui-org/react";
import Gallery from "../gallery/page";
import Events from "../events/page";

export const revalidate = 5;

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

export default async function Home({ params }) {
  const { locale } = params;
  const database = await getData();

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
        <Image
          className={styles.background_image}
          alt="background_image"
          src={
            database?.home?.background_image?.src ||
            "https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/default_img.jpg"
          }
          quality={100}
          priority={true} // если true - loading = 'lazy' отменяеться
          loading="eager" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
          fill={false} //заставляет изображение заполнять родительский элемент
          sizes="100%"
          width={300} // задать правильное соотношение сторон адаптивного изображения
          height={200}
        />
        <div className={styles.container_main}>
          {database?.home?.main_image?.src ? (
            <Image
              className={styles.main_image}
              alt="mainImage"
              src={database.home.main_image.src || ""}
              quality={100}
              priority={true} // если true - loading = 'lazy' отменяеться
              loading="eager" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
              fill={false} //заставляет изображение заполнять родительский элемент
              sizes="100%"
              width={300} // задать правильное соотношение сторон адаптивного изображения
              height={200}
            />
          ) : (
            <Image
              className={styles.main_image}
              alt="Main Image"
              src="https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/default_img.jpg"
              quality={50} //качество картнки в %
              priority={true} // если true - loading = 'lazy' отменяеться
              loading="eager" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
              fill={false} //заставляет изображение заполнять родительский элемент
              sizes="100%"
              width={300} // задать правильное соотношение сторон адаптивного изображения
              height={200}
            />
          )}
          <div className={styles.main_block_description}>
            <h1 className={styles.artist_name}>
              <span className={styles.firstName}>
                {database?.home?.name?.[locale]?.split(" ")[0] || "Олександр"}
              </span>{" "}
              <span className={styles.lastName}>
                {database?.home?.name?.[locale]?.split(" ")[1] ||
                  "Малаховський"}
              </span>
            </h1>
            <p className={styles.artist_name__description}>
              {database?.home?.description?.[locale] ||
                "Галерея мого живопису, де є тільки справжні полотно/олія, INDUSTRIAL art та реальні люди у вигаданих стилізаціях та ще трішки темної сторони. Без використання ШІ, котиків та гумору про дівчат."}
            </p>
          </div>
        </div>
      </section>
      <div className={styles.dividing_strip}>
      <Gallery params={{ locale }} />
      </div>
      
      <Events params={{ locale }} />
    </>
  );
}
