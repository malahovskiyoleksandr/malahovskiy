"use client";

import styles from "./event.module.scss";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Spinner } from "@nextui-org/react";
import PhotoSwipeLightbox from "photoswipe/lightbox";

// export async function generateStatic({ params }) {
//   const { locale } = params;
//   return events.map((event) => ({
//     slug: event[locale].title, // формируем slug на основе локали
//   }));
// }

export default function EventPage({ params }) {
  const { slug, locale } = params;
  const [database, setDatabase] = useState();

  useEffect(() => {
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
    loadData();
  }, []);

  useEffect(() => {
    let lightbox; // Инициализация Lightbox

    // Инициализация PhotoSwipe Lightbox
    if (typeof window !== "undefined") {
      lightbox = new PhotoSwipeLightbox({
        gallery: "#gallery",
        children: "a",
        pswpModule: () => import("photoswipe"),
        wheelToZoom: true,
      });

      // Добавляем кастомную кнопку
      // lightbox.on("uiRegister", () => {
      //   // Регистрация кастомной кнопки
      //   lightbox.pswp.ui.registerElement({
      //     name: "info-button",
      //     ariaLabel: "Photo Info",
      //     order: 15, // Порядок отображения
      //     isButton: true,
      //     html: `
      //       <button
      //         class="${styles.popupButton}
      //         id="info-button">
      //         Info
      //       </button>`, // HTML кнопки
      //     onClick: (event, el, pswp) => {
      //       event.stopPropagation();
      //       const currentSlide = pswp.currSlide;
      //       const photoId =
      //         currentSlide?.data?.element?.getAttribute("data-id");

      //       const photoData = database?.gallery?.industrial?.page.find(
      //         (img) => img.id === Number(photoId)
      //       );

      //       const popupContainer = document.createElement("div");
      //       popupContainer.className = styles.popupContainer;
      //       popupContainer.innerHTML = `
      //           <h3 class="${styles.popupTitle}">Информация о фото</h3>
      //           <p class="${styles.popupDescription}"><strong>Описание:</strong> ${photoData?.name[locale]}</p>
      //           <p class="${styles.popupDescription}"><strong>Источник:</strong> ${photoData?.description[locale]}</p>
      //           <button class="${styles.closePopupButton}" id="close-popup">Закрыть</button>
      //         `;
      //       document.body.appendChild(popupContainer);

      //       document
      //         .getElementById("close-popup")
      //         .addEventListener("click", () => {
      //           popupContainer.remove();
      //         });
      //     },
      //   });
      // });
      lightbox.init();
    }

    return () => {
      // Очистка всех ресурсов
      if (lightbox) lightbox.destroy();
    };
  }, [database]);

  const decodedSlug = decodeURIComponent(slug);
  // redirect(`/${locale}/events/${encodeURIComponent(localizedSlug)}`);

  // Находим событие по текущему `slug`
  const event = database?.events.find(
    (event) => event.title[locale] === decodedSlug
  );

  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner color="warning" label="Loading" labelColor="warning" />
      </div>
    );
  }

  return (
    <section className={styles.main_block}>
      <div className={styles.event}>
        <h1 className={styles.event_name}>{event.title[locale]}</h1>
        <span className={styles.event_data}>28 жовтня 2024</span>
        <div className={styles.event_content}>
          {event.content.map((block, index) => {
            if (block.type === "text") {
              return (
                <p key={index} className={styles.event__description_content}>
                  {block.value[locale]}
                </p>
              );
            } else if (block.type === "image") {
              return (
                <div className={styles.event_images_box} key={index}>
                  <Image
                    className={styles.event_images}
                    // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                    // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                    alt={block.description[locale] || "Event Image"}
                    src={block.src}
                    // placeholder="blur" // размытие заднего фона при загрузке картинки
                    // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
                    quality={100} //качество картнки в %
                    priority={true} // если true - loading = 'lazy' отменяеться
                    // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
                    fill={true} //заставляет изображение заполнять родительский элемент
                    // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
                    sizes="100%"
                    // width={300} // задать правильное соотношение сторон адаптивного изображения
                    // height={200}
                    style={
                      {
                        // width: "200px",
                        // height: "200px",
                        // objectFit: "cover", // Изображение масштабируется, обрезая края
                        // objectFit: "contain", // Изображение масштабируется, не обрезаясь
                        // objectPosition: "top",
                        // margin: "0 0 1rem 0",
                      }
                    }
                  />
                </div>
              );
            } else if (block.type === "imageS") {
              return (
                <div
                  id="gallery"
                  key={index}
                  className={styles.event_images_box}
                >
                  {block.src.map((image, subIndex) => (
                    <a
                      className={styles.image_Link}
                      key={subIndex}
                      href={image.href}
                      data-pswp-width={image.width}
                      data-pswp-height={image.height}
                      data-id={image.href}
                    >
                      <Image
                        id={image.href}
                        className={styles.event_images}
                        // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                        // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                        alt={`Image ${subIndex}`}
                        src={image.href}
                        // placeholder="blur" // размытие заднего фона при загрузке картинки
                        // blurDataURL="/path-to-small-blurry-version.jpg" // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
                        quality={100}
                        priority={true} // если true - loading = 'lazy' отменяеться
                        // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
                        fill={true} //заставляет изображение заполнять родительский элемент
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
                        // sizes="100vh"
                        // width={500} // задать правильное соотношение сторон адаптивного изображения
                        // height={500}
                      />
                    </a>
                  ))}
                </div>
              );
            } else if (block.type === "video") {
              // return (
              //   <div key={index} className={styles.event_video}>
              //     <video controls>
              //       <source src={block.src} type="video/mp4" />
              //       Your browser does not support the video tag.
              //     </video>
              //   </div>
              // );
            }
            return null;
          })}
        </div>
      </div>
    </section>
  );
}
