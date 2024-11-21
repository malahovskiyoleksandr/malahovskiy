import Image from "next/image";
import mainImage from "@/public/images/mainPhoto.jpg";
import styles from "./home.module.scss";
// import { motion } from "framer-motion";

async function getPersonData() {
  const sanya = {
    uk: {
      name: "Олександр Малаховський",
      description:
        "Тільки недолугі громадяни можуть не сприйняти той факт, що бути художником це круто, т.к. художнику можно все))))",
    },
    en: {
      name: "Oleksandr Malakhovsky",
      description:
        "Determining our own reality is a deeply personal and subjective experience.",
    },
    de: {
      name: "Oleksandr Malakhovskyi",
      description:
        "Die Definition unserer eigenen Realität ist eine zutiefst persönliche und subjektive Erfahrung.",
    },
  };
  return {
    sanya,
  };
}

export default async function Home({ params }) {
  const { locale } = params;
  const person = await getPersonData();

  return (
    <>
      <section className={styles.main_block}>
        {/* <div className={styles.backgroundImage_block}>
          <Image
            className={styles.backgroundImage}
            // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
            // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
            alt="backgroundImage"
            src={backgroundImage}
            placeholder="blur" // размытие заднего фона при загрузке картинки
            // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
            quality={100}
            priority={true} // если true - loading = 'lazy' отменяеться
            loading="eager" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
            fill={false} //заставляет изображение заполнять родительский элемент
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
            sizes="100vw"
            // width={300} // задать правильное соотношение сторон адаптивного изображения
            // height={200}
            style={
              {
                // width: "100%",
                // height: "auto",
                // objectFit: "cover", // Изображение масштабируется, не обрезаясь
                // objectFit: "contain", // Изображение масштабируется, не обрезаясь
                // objectPosition: "top",
              }
            }
          />
        </div> */}
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
            <h1 className={styles.artist_name}>
              {person.sanya[locale].name}
            </h1>
            <p className={styles.artist_name__description}>
              {person.sanya[locale].description}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
export const revalidate = 60;
