// import { motion } from "framer-motion";
import Image from "next/image";
import mainImage from "@/public/images/mainPhoto.jpg";
import styles from "./home.module.scss";

export async function getData() {
  const GITHUB_API_URL = `https://api.github.com/repos/malahovskiyoleksandr/malahovskiy/contents/data/home.json`;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Храните токен в переменных окружения

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`, // Аутентификация через токен
        Accept: "application/vnd.github.v3+json", // Версия API
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from GitHub");
    }

    const data = await response.json();
    const jsonString = Buffer.from(data.content, "base64").toString("utf-8");

    return {
      jsonString,
    };
  } catch (error) {
    console.error("Error:", error.message); // Логируем ошибку
    return {
      notFound: true,
    };
  }
}


export default async function Home({ params }) {
  const { locale } = params;
  const person = await getData(locale);
  const personObj = JSON.parse(person.jsonString)
  // console.log(personObj.home.uk.name);

  return (
    <>
      <section className={styles.main_block}>
        <div
          className={styles.container_main}
          // initial="hiddenLeft"
          // animate="visible"
          // transition={{ duration: 0.5 }}
          // // transition: {
          // //   duration: 1, // Длительность анимации
          // //   ease: [0.4, 0, 0.2, 1], // Плавность анимации
          // //   delay: 0.5, // Задержка анимации на 0.5 секунд
          // // },
          // variants={imageVariants}
        >
          <Image
            className={styles.main_image}
            // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
            // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
            alt="mainImage"
            src={mainImage}
            placeholder="blur" // размытие заднего фона при загрузке картинки
            // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
            quality={100}
            priority={false} // если true - loading = 'lazy' отменяеться
            loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
            fill={false} //заставляет изображение заполнять родительский элемент
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
            sizes="100%"
            // width={300} // задать правильное соотношение сторон адаптивного изображения
            // height={200}
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
            <h1 className={styles.artist_name}>{
              personObj.home.uk.name
            }</h1>
            <p className={styles.artist_name__description}>
              {personObj.home.uk.description}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
export const revalidate = 10;
