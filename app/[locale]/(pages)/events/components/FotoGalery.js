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
// import styles from "../events.module.scss";
import styles from "./gallery.module.scss";

function FotoGalery({ event }) {
  const onInit = () => {
    // console.log("lightGallery has been initialized");
  };

  return (
    <LightGallery
      elementClassNames={styles.LightGallery}
      onInit={onInit}
      speed={300}
      plugins={[lgThumbnail, lgZoom, lgVideo]}
    >
      {event.photoGallery ? (
        <Link
          className={styles.Item_LightGallery}
          href={event.photoGallery[0].src}
          data-src={event.photoGallery[0].src}
        >
          <Image
            className={styles.main_photo}
            // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
            // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
            alt={"image"}
            src={event.photoGallery[0].src}
            // placeholder="blur" // размытие заднего фона при загрузке картинки
            // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
            quality={100}
            priority={false} // если true - loading = 'lazy' отменяеться
            loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
            fill={false} //заставляет изображение заполнять родительский элемент
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
            sizes="100%"
            width={300} // задать правильное соотношение сторон адаптивного изображения
            height={200}
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
        </Link>
      ) : (
        <Image
          className={styles.main_photo}
          // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
          // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
          alt={"image"}
          src={event.main_image}
          // placeholder="blur" // размытие заднего фона при загрузке картинки
          // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
          quality={100}
          priority={false} // если true - loading = 'lazy' отменяеться
          loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
          fill={false} //заставляет изображение заполнять родительский элемент
          // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
          sizes="100%"
          width={300} // задать правильное соотношение сторон адаптивного изображения
          height={200}
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
      )}

      {event.photoGallery?.slice(1).map((item, index) => (
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
          style={{ display: "none" }} // Скрываем элементы на странице
        >
          {item.type === "image" ? (
            <Image
              className={styles.Image_LightGallery}
              // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
              // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
              alt={`img${index + 1}`}
              src={item.src}
              // placeholder="blur" // размытие заднего фона при загрузке картинки
              // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
              quality={50}
              priority={false} // если true - loading = 'lazy' отменяеться
              loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
              fill={false} //заставляет изображение заполнять родительский элемент
              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
              sizes="100%"
              width={300} // задать правильное соотношение сторон адаптивного изображения
              height={200}
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
          ) : (
            console.log("error")
          )}
        </Link>
      ))}
    </LightGallery>
  );
}

export default FotoGalery;
