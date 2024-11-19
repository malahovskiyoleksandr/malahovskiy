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
import styles from "../portraits.module.scss";

function Portraits_Gallery() {
  const onInit = () => {
    console.log("lightGallery has been initialized");
  };

  const items = [
    {
      src: "/gallery/portraits/1.jpg",
      type: "image",
      description: "Назва картини"
    },
    {
      src:  "/gallery/portraits/2.jpg",
      type: "image",
      description: "Назва картини"
    },
    {
      src: "/gallery/portraits/3.jpg",
      type: "image",
      description: "Назва картини"
    },
    {
      src:  "/gallery/portraits/4.jpg",
      type: "image",
      description: "Назва картини"
    },
    {
      src: "/gallery/portraits/5.jpg",
      type: "image",
      description: "Назва картини"
    },
    {
      src:  "/gallery/portraits/6.jpg",
      type: "image",
      description: "Назва картини"
    },
  ];

  return (
    <LightGallery
      elementClassNames={styles.LightGallery}
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
                elementClassNames={styles.Image_LightGallery}
                className={styles.Image_LightGallery}
                alt={`img${index + 1}`}
                src={item.src}
                // placeholder="blur"
                quality={100}
                fill
                // sizes="(min-width: 808px) 50vw, 100vw"
                style={{
                  width: "100%", // Задает ширину изображения на 100% ширины контейнера
                  // height: "auto", // Автоматическая высота для сохранения пропорций
                  objectFit: "cover", // Изображение масштабируется, не обрезаясь
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

export default Portraits_Gallery;
