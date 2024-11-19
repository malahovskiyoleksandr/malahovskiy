import Link from "next/link";
// import { motion } from "framer-motion"; // Импортируем framer-motion
import styles from "./gallery.module.scss";
import Image from "next/image";
import dark_side from "@/public/gallery/dark_side.jpg";
import industrial from "@/public/gallery/industrial.jpg";
import portraits from "@/public/gallery/portraits.jpg";
// import getIntl from "@/app/intl";

// Анимации для каждого изображения
// const imageVariants = {
//   hiddenLeft: { opacity: 0, x: -200 }, // Появление слева
//   hiddenRight: { opacity: 0, x: 200 }, // Появление справа
//   hiddenTop: { opacity: 0, y: -200 }, // Появление сверху
//   visible: { opacity: 1, x: 0, y: 0 }, // Конечное состояние
// };

async function getCollection_Lines_Data() {
  const collections = [
    {
      href: "/gallery/industrial",
      alt: "industrial",
      src: industrial,
      name: {
        uk: "industrial art",
        en: "industrial art",
        de: "Industrielle Kunst",
      },
    },
    {
      href: "/gallery/portraits",
      alt: "portraits",
      src: portraits,
      name: "portraits",
      name: {
        uk: "стилізація образiв",
        en: "image stylization",
        de: "bildstilisierung",
      },
    },
    {
      href: "/gallery/dark_side",
      alt: "dark_side",
      src: dark_side,
      name: {
        uk: "dark side",
        en: "dark side",
        de: "dunkle seite",
      },
    },
  ];
  return collections;
}

export default async function Gallery({ params: { locale } }) {
  const collectionLines = await getCollection_Lines_Data();

  return (
    <section className={styles.type_pictures}>
      {collectionLines.map((line, index) => (
        <Link
          key={line.href}
          className={styles.link}
          href={line.href}
          style={{
            flexDirection: index % 2 === 1 ? "row-reverse" : "unset",
          }}
        >
          <Image
            className={styles.image}
            // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
            // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
            alt={line.alt}
            src={line.src}
            placeholder="blur" // размытие заднего фона при загрузке картинки
            // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
            quality={50}
            priority={false} // если true - loading = 'lazy' отменяеться
            // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
            fill={true} //заставляет изображение заполнять родительский элемент
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
            sizes="100vh"
            // width={300} // задать правильное соотношение сторон адаптивного изображения
            // height={200}
            style={{
              // width: "100%",
              // height: "200px",
              objectFit: "cover", // Изображение масштабируется, обрезаясь
              // objectFit: "contain", // Изображение масштабируется, не обрезаясь
              // objectPosition: line.index === 0 ? "0% 30%" : "top",
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
          <div
            className={styles.description}
            style={{
              textAlign: index % 2 === 1 ? "right" : "left",
            }}
          >
            <h2 className={styles.name}>{line.name[locale]}</h2>
            <p className={styles.about}>
              Определение нашей собственной реальности — это глубоко личный и
              субъективный опыт. Хотя мы никогда не сможем знать всего, мы можем
              стремиться быть открытыми для новых идей
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}
