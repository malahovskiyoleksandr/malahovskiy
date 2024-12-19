"use client";

import styles from "./event.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import {
  Textarea,
  Tabs,
  Tab,
  Card,
  CardBody,
  Input,
  Button,
  Spinner,
  RadioGroup,
  Radio,
} from "@nextui-org/react";

export default function EventPage({ params }) {
  const { slug, locale } = params; // Получаем slug и текущую локаль

  const [database, setDatabase] = useState();
  const [isLoading, setIsLoading] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);

  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/github-get");
        if (!response.ok) {
          throw new Error("Ошибка при обращении к API GET");
        }
        const data = await response.json();

        const event = data.events.find((event) => {
          return generateSlug(event.title["en"]) === slug; // Возвращаем результат сравнения
        });

        if (!event) {
          throw new Error("Событие не найдено");
        }

        setDatabase(event);
      } catch (error) {
        console.error("Ошибка: fetch(github-get)", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [slug, locale]);

  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       const response = await fetch("/api/github-get");
  //       if (!response.ok) {
  //         throw new Error("Ошибка при обращении к API GET");
  //       }
  //       const data = await response.json();
  //       setDatabase(data);
  //     } catch (error) {
  //       console.error("Ошибка: fetch(github-get)", error);
  //     }
  //   };
  //   loadData();
  // }, []);

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

  // Обновление значений в базе
  const handleChange = (e, path) => {
    const { name, value } = e.target;

    setDatabase((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let target = updated;

      // Достаем нужный объект для обновления
      keys.slice(0, -1).forEach((key) => {
        target = target[key];
      });

      target[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  // Отправка изменений на сервер
  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      filePath: "data/database.json",
      fileContent: JSON.stringify(database, null, 2),
      commitMessage: "Изменения через админ-панель",
    };

    try {
      const response = await fetch("/api/github-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Ошибка при обновлении данных");
      }

      const result = await response.json();
      console.log("Изменения успешно сохранены:", result);
    } catch (error) {
      console.error("Ошибка сохранения:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[95vh]">
        <Spinner color="warning" label="Loading" labelColor="warning" />
      </div>
    );
  }

  if (!database) {
    return (
      <div className="flex items-center justify-center h-[95vh]">
        <p>Событие не найдено</p>
      </div>
    );
  }

  return (
    <section className={styles.main_block}>
      <div className={styles.event}>
        {["uk", "en", "de"].map((lang) => (
          <Textarea
            key={lang}
            className={styles.textarea}
            label={`Описание (${lang.toUpperCase()})`}
            value={database.title[lang]}
            onChange={(e) => handleChange(e, `events.description.${lang}`)}
          />
        ))}
        <h1 className={styles.event_name}>{database.title[locale]}</h1>
        <span className={styles.event_data}>28 жовтня 2024</span>
        <div className={styles.event_content}>
          {database.content.map((block, index) => {
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
        <Button color="success" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </div>
    </section>
  );
}
