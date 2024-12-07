"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lightbox = new PhotoSwipeLightbox({
        gallery: "#gallery",
        children: "a",
        pswpModule: () => import("photoswipe"),
        // imageScaleMode: "zoom"
      });
      lightbox.init();

      return () => {
        lightbox.destroy(); // Уничтожить экземпляр при размонтировании
      };
    }
  }, []);

  return (
    <div id="gallery" className={styles.image_list}>
      {images.map((image, index) => (
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
            // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
            quality={10}
            priority={true} // если true - loading = 'lazy' отменяеться
            // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
            fill={false} //заставляет изображение заполнять родительский элемент
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
            sizes="100vh"
            width={image.width} // задать правильное соотношение сторон адаптивного изображения
            height={image.height}
            // style={{
            //   width: "350px",
            //   height: "250px",
            //   objectFit: "cover", // Изображение масштабируется, обрезаясь
            //     objectFit: "contain", // Изображение масштабируется, не обрезаясь
            //     objectPosition: line.index === 0 ? "0% 30%" : "top",
            //     objectPosition:
            //       index === 0
            //         ? "0% 50%"
            //         : index === 1
            //         ? "0% 30%"
            //         : index === 2
            //         ? "0% 45%"
            //         : "center",
            // }}
          />
          {/* <label htmlFor={image.id}>{image.name}</label> */}
        </Link>
      ))}
    </div>
  );
}
