"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import styles from "./industrial.module.scss";

const images = [
  {
    id: 1,
    src: "/gallery/industrial/1.jpg",
    width: 1600,
    height: 1295,
    name: "Image 1",
  },
  {
    id: 2,
    src: "/gallery/industrial/2.jpg",
    width: 745,
    height: 1000,
    name: "Image 2",
  },
  {
    id: 3,
    src: "/gallery/industrial/3.jpg",
    width: 1920,
    height: 1228,
    name: "Image 3",
  },
  {
    id: 4,
    src: "/gallery/industrial/4.jpg",
    width: 1920,
    height: 926,
    name: "Image 4",
  },
  {
    id: 5,
    src: "/gallery/industrial/5.jpg",
    width: 1920,
    height: 2753,
    name: "Image 5",
  },
  {
    id: 6,
    src: "/gallery/industrial/6.jpg",
    width: 1920,
    height: 1519,
    name: "Image 6",
  },
  {
    id: 7,
    src: "/gallery/industrial/7.jpg",
    width: 1920,
    height: 2486,
    name: "Image 7",
  },
  {
    id: 8,
    src: "/gallery/industrial/8.jpg",
    width: 1920,
    height: 1463,
    name: "Image 8",
  },
  {
    id: 9,
    src: "/gallery/industrial/9.jpg",
    width: 1920,
    height: 1346,
    name: "Image 9",
  },
  {
    id: 10,
    src: "/gallery/industrial/10.jpg",
    width: 1920,
    height: 1473,
    name: "Image 10",
  },
  {
    id: 11,
    src: "/gallery/industrial/11.jpg",
    width: 8160,
    height: 5987,
    name: "Image 11",
  },
  {
    id: 12,
    src: "/gallery/industrial/12.jpg",
    width: 6115,
    height: 8160,
    name: "Image 12",
  },
];

export default function PhotoGallery() {
  const [database, setDatabase] = useState();

  const image_listRef = useRef(null);

  // useEffect(() => {
  //   async function getData() {
  //     try {
  //       const response = await fetch("https://api.github.com/repos/malahovskiyoleksandr/malahovskiy/contents/data/database.json");
  //       if (!response.ok) {
  //         throw new Error("Ошибка при обращении к API GET");
  //       }
  //       const data = await response.json();
  //       const decodedData = JSON.parse(
  //         Buffer.from(data.content, "base64").toString("utf-8")
  //       );
  //       setDatabase(decodedData);
  //     } catch (error) {
  //       console.error("Ошибка: fetch(github-get)", error);
  //     }
  //   }
  //   getData()
  // }, []);

  // Загружаем данные с API
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       const response = await fetch("/api/github-get");
  //       if (!response.ok) {
  //         throw new Error("Ошибка при обращении к API GET");
  //       }
  //       const data = await response.json();
  //       setDatabase(data);
  //       // setLoading(false);
  //     } catch (error) {
  //       console.error("Ошибка: fetch(github-get)", error);
  //     }
  //   };

  //   loadData();
  // }, []);

  useEffect(() => {
    // Инициализация PhotoSwipe Lightbox
    if (typeof window !== "undefined") {
      const lightbox = new PhotoSwipeLightbox({
        gallery: "#gallery",
        children: "a",
        pswpModule: () => import("photoswipe"),
      });
      lightbox.init();

      return () => {
        lightbox.destroy(); // Уничтожить экземпляр при размонтировании
      };
    }
  }, []);

  const handleWheel = (e) => {
    const image_list = image_listRef.current;
    if (image_list) {
      e.preventDefault(); // Отключаем стандартную прокрутку

      const delta = Math.max(-1, Math.min(1, e.deltaY || -e.detail)); // Направление прокрутки
      const scrollAmount = delta * 500; // Количество пикселей для прокрутки

      let start = image_list.scrollLeft;
      let end = start + scrollAmount;
      let startTime = null;

      // Функция для анимации прокрутки
      const animateScroll = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / 200; // 300 — это продолжительность анимации в миллисекундах

        if (progress < 1) {
          // Интерполяция между стартовым и конечным значением
          image_list.scrollLeft = start + (end - start) * progress;
          requestAnimationFrame(animateScroll); // Запрашиваем следующий кадр анимации
        } else {
          image_list.scrollLeft = end; // Устанавливаем окончательное значение
        }
      };

      requestAnimationFrame(animateScroll); // Начинаем анимацию
    }
  };

  useEffect(() => {
    const image_list = image_listRef.current;
    if (image_list) {
      image_list.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        image_list.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  // const images = database?.gallery?.industrial?.page;
  // console.log(database)

  return (
    <div id="gallery" className={styles.image_list} ref={image_listRef}>
      {/* {console.log(database?.gallery?.industrial?.page)} */}
      {/* {database?.gallery?.industrial?.page.map((image, index) => ( */}
      {images?.map((image, index) => (
        <Link
          className={styles.image_Link}
          key={index}
          href={image.src}
          data-pswp-width={image.width}
          data-pswp-height={image.height}
        >
          <Image
            id={image.id}
            className={styles.image}
            // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
            // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
            alt={image.name}
            src={image.src}
            // placeholder="blur" // размытие заднего фона при загрузке картинки
            // blurDataURL="/path-to-small-blurry-version.jpg" // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
            quality={10}
            priority={true} // если true - loading = 'lazy' отменяеться
            // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
            fill={false} //заставляет изображение заполнять родительский элемент
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
            // sizes="100vh"
            width={image.width} // задать правильное соотношение сторон адаптивного изображения
            height={image.height}
          />
          <label htmlFor={image.id} className={styles.image_label}>
            {image.name}
          </label>
        </Link>
      ))}
    </div>
  );
}

// "use client";

// import { useEffect, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import PhotoSwipeLightbox from "photoswipe/lightbox";
// import styles from "./industrial.module.scss";
// import imagesData from "@/data/database.json";

// export default function PhotoGallery() {
//   const images = imagesData.gallery.industrial.page;
//   const image_listRef = useRef(null);

//   useEffect(() => {
//     // Инициализация PhotoSwipe Lightbox
//     if (typeof window !== "undefined") {
//       const lightbox = new PhotoSwipeLightbox({
//         gallery: "#gallery",
//         children: "a",
//         pswpModule: () => import("photoswipe"),
//       });
//       lightbox.init();

//       return () => {
//         lightbox.destroy(); // Уничтожить экземпляр при размонтировании
//       };
//     }
//   }, []);

//   useEffect(() => {
//     const image_list = image_listRef.current;

//     function scrollHorizontally(e) {
//       e = window.event || e; // Поддержка IE и современных браузеров
//       const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail)); // Направление прокрутки
//       if (image_list) {
//         e.preventDefault(); // Отключаем стандартную вертикальную прокрутку
//         image_list.scrollBy({
//           left: delta * 200, // Прокрутка по горизонтали
//           behavior: "smooth", // Плавная прокрутка
//         });
//       }
//     }

//     if (image_list) {
//       if (image_list.addEventListener) {
//         // Современные браузеры
//         image_list.addEventListener("wheel", scrollHorizontally, {
//           passive: false,
//         });
//         image_list.addEventListener("mousewheel", scrollHorizontally, false);
//         image_list.addEventListener(
//           "DOMMouseScroll",
//           scrollHorizontally,
//           false
//         ); // Firefox
//       } else if (image_list.attachEvent) {
//         // Для старых версий IE
//         image_list.attachEvent("onmousewheel", scrollHorizontally);
//       }
//     }

//     return () => {
//       if (image_list) {
//         image_list.removeEventListener("mousewheel", scrollHorizontally);
//         image_list.removeEventListener("DOMMouseScroll", scrollHorizontally);
//       }
//     };
//   }, []);

//   return (
//     <div id="gallery" className={styles.image_list} ref={image_listRef}>
//       {images.map((image, index) => (
//         <Link
//           className={styles.image_Link}
//           key={index}
//           href={image.src}
//           data-pswp-width={image.width}
//           data-pswp-height={image.height}
//         >
//           <Image
//             id={image.id}
//             className={styles.image}
//             // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
//             // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
//             alt={image.name}
//             src={image.src}
//             // placeholder="blur" // размытие заднего фона при загрузке картинки
//             // blurDataURL="/path-to-small-blurry-version.jpg" // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
//             quality={10}
//             priority={true} // если true - loading = 'lazy' отменяеться
//             // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
//             fill={false} //заставляет изображение заполнять родительский элемент
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
//             // sizes="100vh"
//             width={image.width} // задать правильное соотношение сторон адаптивного изображения
//             height={image.height}
//             // style={{
//             //   width: "350px",
//             //   height: "250px",
//             //   objectFit: "cover", // Изображение масштабируется, обрезаясь
//             //     objectFit: "contain", // Изображение масштабируется, не обрезаясь
//             //     objectPosition: line.index === 0 ? "0% 30%" : "top",
//             //     objectPosition:
//             //       index === 0
//             //         ? "0% 50%"
//             //         : index === 1
//             //         ? "0% 30%"
//             //         : index === 2
//             //         ? "0% 45%"
//             //         : "center",
//             // }}
//           />
//           <label htmlFor={image.id}>{image.name}</label>
//         </Link>
//       ))}
//     </div>
//   );
// }
