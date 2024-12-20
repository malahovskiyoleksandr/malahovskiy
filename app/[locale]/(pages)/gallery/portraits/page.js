"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import styles from "../gallery.module.scss";
import { Tooltip } from "@nextui-org/tooltip";
import { Spinner } from "@nextui-org/react";

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

    // Инициализация PhotoSwipe Lightbox
    if (typeof window !== "undefined") {
      lightbox = new PhotoSwipeLightbox({
        gallery: "#gallery",
        children: "a",
        pswpModule: () => import("photoswipe"),
        wheelToZoom: true,
      });

      // Добавляем кастомную кнопку
      lightbox.on("uiRegister", () => {
        // Регистрация кастомной кнопки
        lightbox.pswp.ui.registerElement({
          name: "info-button",
          ariaLabel: "Photo Info",
          order: 15, // Порядок отображения
          isButton: true,
          html: `
            <button
              class="${styles.popupButton}
              id="info-button">
              Info
            </button>`, // HTML кнопки
          onClick: (event, el, pswp) => {
            event.stopPropagation();
            const currentSlide = pswp.currSlide;
            const photoId =
              currentSlide?.data?.element?.getAttribute("data-id");

            const photoData = database?.gallery?.portraits?.page.find(
              (img) => img.id === Number(photoId)
            );

            const popupContainer = document.createElement("div");
            popupContainer.className = styles.popupContainer;
            popupContainer.innerHTML = `
                <h3 class="${styles.popupTitle}">Информация о фото</h3>
                <p class="${styles.popupDescription}"><strong>Описание:</strong> ${photoData?.name[locale]}</p>
                <p class="${styles.popupDescription}"><strong>Источник:</strong> ${photoData?.description[locale]}</p>
                <button class="${styles.closePopupButton}" id="close-popup">Закрыть</button>
              `;
            document.body.appendChild(popupContainer);

            document
              .getElementById("close-popup")
              .addEventListener("click", () => {
                popupContainer.remove();
              });
          },
        });
      });
      lightbox.init();
    }

    const addScrollListeners = () => {
      if (image_list) {
        image_list.addEventListener("wheel", handleWheel, { passive: false });
        image_list.addEventListener("mousewheel", handleWheel, false);
        image_list.addEventListener("DOMMouseScroll", handleWheel, false); // Firefox
      }
    };
    addScrollListeners();

    // Удаление слушателей событий прокрутки
    const removeScrollListeners = () => {
      if (image_list) {
        image_list.removeEventListener("wheel", handleWheel);
        image_list.removeEventListener("mousewheel", handleWheel);
        image_list.removeEventListener("DOMMouseScroll", handleWheel);
      }
    };

    return () => {
      // Очистка всех ресурсов
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
      {database?.gallery?.portraits?.page.map((image, index) => (
        <a
          className={styles.image_Link}
          key={index}
          href={image.src}
          data-pswp-width={image.width}
          data-pswp-height={image.height}
          data-id={image.id}
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
            quality={40}
            priority={true} // если true - loading = 'lazy' отменяеться
            // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
            fill={false} //заставляет изображение заполнять родительский элемент
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
            // sizes="100vh"
            width={image.width} // задать правильное соотношение сторон адаптивного изображения
            height={image.height}
          />
          <div className={styles.tooltip}>
            <div className={styles.tooltip_name}>{image.name[locale]}</div>
            <div className={styles.tooltip_description}>
              {image.description[locale]}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
