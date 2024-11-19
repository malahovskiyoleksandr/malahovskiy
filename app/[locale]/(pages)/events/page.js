import styles from "./events.module.scss";
import Link from "next/link";
import Image from "next/image";
// import { motion } from "framer-motion";
// import { useTranslation } from "react-i18next";
import { EventsData } from "./events";

// const imageVariants = {
//   hiddenLeft: { opacity: 0, x: -200 }, // Появление слева
//   hiddenRight: { opacity: 0, x: 200 }, // Появление справа
//   hiddenTop: { opacity: 0, y: -200 }, // Появление сверху
//   hiddenDown: { opacity: 0, y: 200 }, // Появление снизу
//   visible: { opacity: 1, x: 0, y: 0 }, // Конечное состояние
// };

export default async function Events({ params }) {
  const { locale } = params;
  const events = await EventsData();

  return (
    <>
      <section className={styles.main_block}>
        <h1 className={styles.zahodu_pidii}>Заходи та події</h1>
        <div className={`${styles.event_list} grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6`}>
          {events.map((event) => (
            <div
              key={event.id}
              className={styles.event}
              // initial="hiddenTop"
              // animate="visible"
              // transition={{ duration: 0.5 }}
              // variants={imageVariants}
            >
              <Link
                href={`/events/${event[locale].title}`}
                className={styles.link}
              >
                <div className={styles.image_box}>
                  <Image
                    className={styles.image}
                    // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                    // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                    alt={event[locale].title}
                    src={event.main_image}
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
                        // width: "100%",
                        // height: "200px",
                        // objectFit: "cover", // Изображение масштабируется, обрезая края
                        // objectFit: "contain", // Изображение масштабируется, не обрезаясь
                        // objectPosition: "top",
                        // margin: "0 0 1rem 0",
                      }
                    }
                  />
                </div>
                <span className={styles.event_data}>28 жовтня 2024</span>
                <h3 className={styles.event_name}>{event[locale].title}</h3>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
export const revalidate = 5;
