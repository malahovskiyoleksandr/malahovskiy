import Link from "next/link";
// import { motion } from "framer-motion"; // Импортируем framer-motion
import styles from "./gallery.module.scss";
import Image from "next/image";
import { NextResponse } from "next/server";
import { Spinner } from "@nextui-org/react";

export const revalidate = 5;
// import dark_side from "@/public/gallery/dark_side.jpg";
// import industrial from "@/public/gallery/industrial.jpg";
// import portraits from "@/public/gallery/portraits.jpg";
// import getIntl from "@/app/intl";

// Анимации для каждого изображения
// const imageVariants = {
//   hiddenLeft: { opacity: 0, x: -200 }, // Появление слева
//   hiddenRight: { opacity: 0, x: 200 }, // Появление справа
//   hiddenTop: { opacity: 0, y: -200 }, // Появление сверху
//   visible: { opacity: 1, x: 0, y: 0 }, // Конечное состояние
// };

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

export default async function Gallery({ params }) {
  const locale = params.locale;
  const collectionLines = await getData();
  console.log(collectionLines)

  if (!collectionLines) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner color="warning" label="Loading" labelColor="warning" />
      </div>
    );
  }

  return (
    <section className={styles.type_pictures}>
      {collectionLines?.events &&
        Object.entries(collectionLines.events).map(([key, value], index) => (
          <h1>111</h1>
        // <Link
        //   key={key}
        //   className={styles.link}
        //   href={value.href}
        //   style={{
        //     flexDirection: index % 2 === 1 ? "row-reverse" : "unset",
        //   }}
        // >
        //   <Image
        //     className={styles.image}
        //     // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
        //     // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
        //     alt={value.name?.[locale] || "Gallery Image"}
        //     src={value.src}
        //     // placeholder="blur" // размытие заднего фона при загрузке картинки
        //     // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
        //     quality={50}
        //     priority={false} // если true - loading = 'lazy' отменяеться
        //     // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
        //     fill={true} //заставляет изображение заполнять родительский элемент
        //     // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
        //     sizes="100vh"
        //     // width={300} // задать правильное соотношение сторон адаптивного изображения
        //     // height={200}
        //     style={{
        //       // width: "100%",
        //       // height: "200px",
        //       objectFit: "cover", // Изображение масштабируется, обрезаясь
        //       // objectFit: "contain", // Изображение масштабируется, не обрезаясь
        //       // objectPosition: line.index === 0 ? "0% 30%" : "top",
        //       objectPosition:
        //         index === 0
        //           ? "0% 50%"
        //           : index === 1
        //           ? "0% 30%"
        //           : index === 2
        //           ? "0% 45%"
        //           : "center",
        //     }}
        //   />
        //   <div
        //     className={styles.description}
        //     style={{
        //       textAlign: index % 2 === 1 ? "right" : "left",
        //     }}
        //   >
        //     <h2 className={styles.name}>{value?.name?.[locale] || ""}</h2>
        //     <p className={styles.about}>{value?.description?.[locale] || ""}</p>
        //   </div>
        // </Link>
      ))}
    </section>
  );
}








// import styles from "./events.module.scss";
// import Link from "next/link";
// import Image from "next/image";
// // import { motion } from "framer-motion";
// // import { useTranslation } from "react-i18next";
// import { Spinner } from "@nextui-org/react";
// import { NextResponse } from "next/server";


// // const imageVariants = {
// //   hiddenLeft: { opacity: 0, x: -200 }, // Появление слева
// //   hiddenRight: { opacity: 0, x: 200 }, // Появление справа
// //   hiddenTop: { opacity: 0, y: -200 }, // Появление сверху
// //   hiddenDown: { opacity: 0, y: 200 }, // Появление снизу
// //   visible: { opacity: 1, x: 0, y: 0 }, // Конечное состояние
// // };

// export async function getData() {
//   try {
//     const response = await fetch(
//       `https://api.github.com/repos/malahovskiyoleksandr/malahovskiy/contents/data/database.json`,
//       {
//         method: "GET",
//         cache: "no-store",
//         headers: {
//           "Cache-Control": "no-cache", // Запрещаем использование кеша
//           // Authorization: `Bearer ${GITHUB_TOKEN}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: "Ошибка при получении данных с GitHub" },
//         { status: response.status }
//       );
//     }

//     const Data = await response.json();
//     const decodedData = JSON.parse(
//       Buffer.from(Data.content, "base64").toString("utf-8")
//     );
//     // Декодирование содержимого файла из base64
//     return decodedData;
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Ошибка сервера: " + error.message },
//       { status: 500 }
//     );
//   }
// }

// export default async function Events({ params }) {
//   const { locale } = params;
//   const database = await getData();

//   if (!database) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Spinner color="warning" label="Loading" labelColor="warning" />
//       </div>
//     );
//   }

//   return (
//     <>
//       <section className={styles.main_block}>
//         <h1 className={styles.zahodu_pidii}>Заходи та події</h1>
//         <div
//           className={`${styles.event_list} grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6`}
//         >
//           {console.log("database", database.events)}
//             {database?.map((event, index) => (
//               <div
//                 key={index}
//                 className={styles.event}
//                 // initial="hiddenTop"
//                 // animate="visible"
//                 // transition={{ duration: 0.5 }}
//                 // variants={imageVariants}
//               >
//                 {/* <Link
//                   href={`/events/${event.title[locale]}`}
//                   className={styles.link}
//                 >
//                   <div className={styles.image_box}>
//                     <Image
//                       className={styles.image}
//                       // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
//                       // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
//                       alt={event.title[locale]}
//                       src={event.main_image}
//                       // placeholder="blur" // размытие заднего фона при загрузке картинки
//                       // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
//                       quality={10} //качество картнки в %
//                       priority={true} // если true - loading = 'lazy' отменяеться
//                       // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
//                       fill={true} //заставляет изображение заполнять родительский элемент
//                       // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
//                       sizes="100%"
//                       // width={300} // задать правильное соотношение сторон адаптивного изображения
//                       // height={200}
//                       style={
//                         {
//                           // width: "200px",
//                           // height: "200px",
//                           // objectFit: "cover", // Изображение масштабируется, обрезая края
//                           // objectFit: "contain", // Изображение масштабируется, не обрезаясь
//                           // objectPosition: "top",
//                           // margin: "0 0 1rem 0",
//                         }
//                       }
//                     /> 
//                   </div>
//                   <span className={styles.event_data}>28 жовтня 2024</span>
//                   <h3 className={styles.event_name}>{event?.title?.[locale] || ''}</h3>
//                 </Link> */}
//               </div>
//             ))}
//         </div>
//       </section>
//     </>
//   );
// }
// export const revalidate = 5;
