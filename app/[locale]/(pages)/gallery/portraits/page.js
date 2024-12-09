"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import styles from "./portraits.module.scss";
// import imagesData from "@/data/database.json";

export default function PhotoGallery() {
  const [database, setDatabase] = useState();

  const image_listRef = useRef(null);

  useEffect(() => {
    // Загружаем данные с API
    const loadData = async () => {
      try {
        const response = await fetch("/api/github-get");
        if (!response.ok) {
          throw new Error("Ошибка при обращении к API GET");
        }
        const data = await response.json();
        setDatabase(data);
        // setLoading(false);
      } catch (error) {
        console.error("Ошибка: fetch(github-get)", error);
      }
    };
    loadData();

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

    const image_list = image_listRef.current;
    if (image_list) {
      image_list.addEventListener("wheel", handleWheel, { passive: false });
      image_list.addEventListener("mousewheel", handleWheel, false);
      image_list.addEventListener("DOMMouseScroll", handleWheel, false); // Firefox

      return () => {
        image_list.removeEventListener("wheel", handleWheel);
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

  // const images = database?.gallery?.industrial?.page;
  // console.log(images)

  return (
    <div id="gallery" className={styles.image_list} ref={image_listRef}>
      {database?.gallery?.portraits?.page.map((image, index) => (
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