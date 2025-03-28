"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import styles from "../gallery.module.scss";
import { Button, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Импортируем компонент для иконок
import { faYoutube } from "@fortawesome/free-brands-svg-icons"; // Импортируем нужные иконки
import { createRoot } from "react-dom/client";

export default function PhotoGallery({ params }) {
  const locale = params.locale;
  const [database, setDatabase] = useState();

  const image_listRef = useRef(null);

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
    const image_list = image_listRef.current;

    if (typeof window !== "undefined") {
      lightbox = new PhotoSwipeLightbox({
        gallery: "#gallery",
        children: "a",
        pswpModule: () => import("photoswipe"),
        wheelToZoom: true,
        imageClickAction: "close"
      });

      lightbox.on("uiRegister", () => {
        lightbox.pswp.ui.registerElement({
          name: "info-button",
          ariaLabel: "Photo Info",
          order: 15,
          isButton: true,
          html: `
            <button
              class="${styles.popupButton}"
              id="info-button">
              ${database.gallery.industrial.info[locale]}
            </button>`,
          onClick: (event, el, pswp) => {
            event.stopPropagation();

            const existingPopup = document.getElementById("popup-container");

            // Если попап уже открыт, закрываем его
            if (existingPopup) {
              existingPopup.remove();
              return;
            }

            // Получаем текущий слайд
            const currentSlide = pswp.currSlide;
            const photoId =
              currentSlide?.data?.element?.getAttribute("data-id");

            const photoData = database?.gallery?.industrial?.page.find(
              (img) => img.id === Number(photoId)
            );

            // Создаём контейнер для попапа
            const popupContainer = document.createElement("div");
            popupContainer.className = styles.popupContainer;
            popupContainer.id = "popup-container";

            popupContainer.innerHTML = `
              <div class="${styles.popupContent}">
                <p class="${styles.popupTitle}">${photoData?.name[locale]}</p>
                <p class="${styles.popupMaterial}">${photoData?.material[locale]}</p>
                <p class="${styles.popupSize}">${photoData?.size}</p>
                <p class="${styles.popupDate}">${photoData?.date}</p>
                <p class="${styles.popupDescription}">${photoData?.description[locale]}</p>
                <div id="VideoBox" class="${styles.VideoBox}"></div>
              </div>
            `;

            document.body.appendChild(popupContainer);

            // Контейнер для динамических кнопок и видео
            const VideoBox = document.getElementById("VideoBox");

            // Создаём root и рендерим компоненты в попап
            const root = createRoot(VideoBox);
            root.render(
              <>
                {photoData?.linkVideo && (
                  <div className={styles.videoContainer}>
                    <iframe
                      src={photoData.linkVideo.replace("watch?v=", "embed/")} // Форматируем ссылку для встраивания YouTube
                      title="YouTube Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className={styles.videoPlayer}
                    ></iframe>
                  </div>
                )}
                <button
                  className={styles.closePopupButton}
                  onClick={() => {
                    const popupContainer =
                      document.getElementById("popup-container");
                    if (popupContainer) {
                      popupContainer.remove();
                    }
                  }}
                >
                  {database?.gallery?.industrial?.close?.[locale] || "Закрыть"}
                </button>
              </>
            );
          },
        });
      });

      lightbox.on("close", () => {
        const popupContainer = document.getElementById("popup-container");
        if (popupContainer) {
          popupContainer.remove();
        }
      });

      lightbox.on("change", () => {
        const popupContainer = document.getElementById("popup-container");
        if (popupContainer) {
          popupContainer.remove();
        }
      });

      lightbox.init();
    }

    const addScrollListeners = () => {
      if (image_list) {
        image_list.addEventListener("wheel", handleWheel, { passive: false });
        image_list.addEventListener("mousewheel", handleWheel, false);
        image_list.addEventListener("DOMMouseScroll", handleWheel, false);
      }
    };
    addScrollListeners();

    const removeScrollListeners = () => {
      if (image_list) {
        image_list.removeEventListener("wheel", handleWheel);
        image_list.removeEventListener("mousewheel", handleWheel);
        image_list.removeEventListener("DOMMouseScroll", handleWheel);
      }
    };

    return () => {
      if (lightbox) lightbox.destroy();
      removeScrollListeners();
    };
  }, [database]);

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

  if (!database) {
    return (
      <div className="flex items-center justify-center h-[95vh]">
        <Spinner color="warning" label="Loading" labelColor="warning" />
      </div>
    );
  }

  return (
    <div id="gallery" className={styles.image_list} ref={image_listRef}>
      {database?.gallery?.industrial?.page.map((image, index) => (
        <a
          className={styles.image_Link}
          key={index}
          href={image.src}
          data-pswp-width={image.width}
          data-pswp-height={image.height}
          data-id={image.id}
        >
          {image.src ? (
            <Image
              id={image.id}
              className={styles.image}
              // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
              // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
              alt={image.name}
              src={image.src}
              // placeholder="blur" // размытие заднего фона при загрузке картинки
              // blurDataURL="/path-to-small-blurry-version.jpg" // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
              quality={80}
              priority={true} // если true - loading = 'lazy' отменяеться
              // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
              fill={false} //заставляет изображение заполнять родительский элемент
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
              // sizes="100vh"
              width={image.width} // задать правильное соотношение сторон адаптивного изображения
              height={image.height}
              style={
                {
                  // objectPosition: line.index === 0 ? "0% 30%" : "top",
                  // objectPosition:
                  //   index === 0
                  //     ? "0% 50%"
                  //     : index === 1
                  //     ? "0% 30%"
                  //     : index === 2
                  //     ? "0% 45%"
                  //     : "center",
                }
              }
            />
          ) : (
            <Image
              className={styles.image}
              // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
              // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
              alt="Main Image"
              src="https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/default_img.jpg"
              // placeholder="blur" // размытие заднего фона при загрузке картинки
              // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
              quality={80} //качество картнки в %
              priority={true} // если true - loading = 'lazy' отменяеться
              // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
              fill={false} //заставляет изображение заполнять родительский элемент
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              width={300} // задать правильное соотношение сторон адаптивного изображения
              height={200}
              style={{
                width: "100%",
                // height: "200px",
                // objectFit: "cover", // Изображение масштабируется, обрезая края
                // objectFit: "contain", // Изображение масштабируется, не обрезаясь
                // objectPosition: "top",
                // margin: "0 0 1rem 0",
              }}
            />
          )}
          <div className={styles.tooltip}>
            <div className={styles.tooltip_name}>{image.name[locale]}</div>
            <div className={styles.tooltip_description}>
              {image.material[locale]}, {image.date}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
