import Link from "next/link";
import styles from "./gallery.module.scss";
import Image from "next/image";
import { NextResponse } from "next/server";
import { Spinner } from "@nextui-org/react";

export const metadata = {
  other: {
    "google-site-verification": "googlee210a71ad2956609.html",
  },
};

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

export default async function Gallery({ params }) {
  const { locale } = await params;
  const collectionLines = await getData();

  if (!collectionLines) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner color="warning" label="Loading" labelColor="warning" />
      </div>
    );
  }

  return (
    <section className={styles.type_pictures}>
      {collectionLines?.gallery &&
        Object.entries(collectionLines.gallery).map(([key, value], index) => (
          <Link
            key={key}
            className={styles.link}
            href={value.href}
            style={{
              flexDirection: index % 2 === 1 ? "row-reverse" : "unset",
            }}
          >
            {value.src ? (
              <Image
                className={styles.image}
                alt={value.name?.[locale] || "Gallery Image"}
                src={value.src}
                quality={80}
                priority={true} // если true - loading = 'lazy' отменяеться
                fill={true} //заставляет изображение заполнять родительский элемент
                sizes="100vh"
                style={{
                  objectFit: "cover", // Изображение масштабируется, обрезаясь
                  objectPosition:
                    index === 0
                      ? "0% 50%"
                      : index === 1
                      ? "0% 30%"
                      : index === 2
                      ? "0% 45%"
                      : "center",
                }}
              />
            ) : (
              <Image
                className={styles.image}
                  alt="Main Image"
                src="https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/default_img.jpg"
                quality={80} //качество картнки в %
                priority={true} // если true - loading = 'lazy' отменяеться
                fill={true} //заставляет изображение заполнять родительский элемент
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            <div
              className={styles.description}
              style={{
                textAlign: index % 2 === 1 ? "right" : "left",
              }}
            >
              <h2 className={styles.name}>{value?.name?.[locale] || ""}</h2>
              <p className={styles.about}>
                {value?.description?.[locale] || ""}
              </p>
            </div>
          </Link>
        ))}
    </section>
  );
}
