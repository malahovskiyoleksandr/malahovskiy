"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgVideo from "lightgallery/plugins/video";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-video.css";
import styles from "../industrial.module.scss";

function Industrial_Gallery() {
  const onInit = () => {
    // console.log("lightGallery has been initialized");
  };

  const items = [
    {
      src: "/gallery/industrial/1.jpg",
      type: "image",
      description: "Картина (Злив чавуну з доменної печі)"
    },
    {
      src:  "/gallery/industrial/2.jpg",
      type: "image",
      description: "Картина (Сходи)"
    },
    {
      src:  "/gallery/industrial/2_ROLLING MILL.jpg",
      type: "image",
      description: "Картина (Сходи)"
    },
    {
      src:  "/gallery/industrial/4_FEELINGS.jpg",
      type: "image",
      description: "Картина (Сходи)"
    },
    {
      src:  "/gallery/industrial/5_OLD BLAST FURNACE.jpg",
      type: "image",
      description: "Картина (Сходи)"
    },
    {
      src:  "/gallery/industrial/6_BLAST FURNACE 2.jpg",
      type: "image",
      description: "Картина (Сходи)"
    },
    {
      src:  "/gallery/industrial/7_BLAST FURNACE 4 (2).jpg",
      type: "image",
      description: "Картина (Сходи)"
    },
    {
      src:  "/gallery/industrial/8_IRON HEART (2).jpg",
      type: "image",
      description: "Картина (Сходи)"
    },
    {
      src:  "/gallery/industrial/9_IRON HEART (1).jpg",
      type: "image",
      description: "Картина (Сходи)"
    },
    {
      src:  "/gallery/industrial/10_BLAST FURNACE 4 (1).jpg",
      type: "image",
      description: "Картина (Сходи)"
    },
    {
      src:  "/gallery/industrial/11_Spectrum.jpg",
      type: "image",
      description: "Картина (Сходи)"
    },
    {
      src:  "/gallery/industrial/12_Emerald city.jpg",
      type: "image",
      description: "Картина (Сходи)"
    },
  ];

  return (
    <LightGallery
      elementClassNames={styles.LightGallery}
      // className={styles.LightGallery}
      onInit={onInit}
      speed={300}
      plugins={[lgThumbnail, lgZoom, lgVideo]}
    >
      {items.map((item, index) => (
        <Link
          className={styles.Item_LightGallery}
          key={index}
          href={item.src}
          data-src={item.src}
          data-sub-html={
            item.type === "video"
              ? `<h4>Video ${index + 1}</h4>`
              : `<h4>${item.description}</h4>`
          }
          data-poster={item.poster} // Добавляем постер для видео
        >
          {item.type === "image" ? (
              <Image
              // elementClassNames={styles.Image_LightGallery}
              className={styles.Image_LightGallery}
                alt={`img${index + 1}`}
                src={item.src}
                // placeholder="blur"
                quality={100}
                fill
                // sizes="(min-width: 808px) 50vw, 100vw"
                style={{
                  // width: "100%", // Задает ширину изображения на 100% ширины контейнера
                  // height: "auto", // Автоматическая высота для сохранения пропорций
                  // objectFit: "cover", // Изображение масштабируется, не обрезаясь
                  // objectFit: "contain", // Изображение масштабируется, не обрезаясь
                  // objectPosition: "top",
                }}
              />
            ) : (console.log("falllll"))}
        </Link>
      ))}
    </LightGallery>
  );
}

export default Industrial_Gallery;
