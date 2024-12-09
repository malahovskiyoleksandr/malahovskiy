"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import styles from "./industrial.module.scss";

export default function PhotoGallery() {
  const [database, setDatabase] = useState();

  const image_listRef = useRef(null);

  useEffect(() => {
    let lightbox; // Инициализация Lightbox
    const loadData = async () => {
      try {
        const response = await fetch("/api/github-get");
        if (!response.ok) {
          throw new Error("Ошибка при обращении к API GET");
        }
        const data = await response.json();
        setDatabase(data);
      } catch (error) {
        console.error("Ошибка: fetch(github-get)", error);
      }
    };
  
    // Вызов загрузки данных
    loadData();
  
    // Инициализация PhotoSwipe Lightbox
    if (typeof window !== "undefined") {
      lightbox = new PhotoSwipeLightbox({
        gallery: "#gallery",
        children: "a",
        pswpModule: () => import("photoswipe"),
      });
      lightbox.init();
    }
  
    const image_list = image_listRef.current;
  
    // Добавление слушателей событий прокрутки
    const addScrollListeners = () => {
      if (image_list) {
        image_list.addEventListener("wheel", handleWheel, { passive: false });
        image_list.addEventListener("mousewheel", handleWheel, false);
        image_list.addEventListener("DOMMouseScroll", handleWheel, false); // Firefox
      }
    };
  
    // Удаление слушателей событий прокрутки
    const removeScrollListeners = () => {
      if (image_list) {
        image_list.removeEventListener("wheel", handleWheel);
        image_list.removeEventListener("mousewheel", handleWheel);
        image_list.removeEventListener("DOMMouseScroll", handleWheel);
      }
    };
  
    addScrollListeners();
  
    return () => {
      // Очистка всех ресурсов
      if (lightbox) lightbox.destroy();
      removeScrollListeners();
    };
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

  return (
    <div id="gallery" className={styles.image_list} ref={image_listRef}>
      {database?.gallery?.industrial?.page.map((image, index) => (
        <Link
          className={styles.image_Link}
          key={index}
          href="#"
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
