"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import styles from "../gallery.module.scss";
import { Tooltip } from "@nextui-org/tooltip";

export default function PhotoGallery({ params }) {
  const locale = params.locale;
  const [database, setDatabase] = useState();

  const image_listRef = useRef(null);

  useEffect(() => {
    let lightbox; // Инициализация Lightbox
    const image_list = image_listRef.current;

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
              style="
                background-color: #007bff;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 4px;
                cursor: pointer;
              "
              id="info-button">
              Info
            </button>`, // HTML кнопки
          onClick: (event, el, pswp) => {
            event.stopPropagation();
            const currentSlide = pswp.currSlide;

            if (!currentSlide) {
              console.error("Нет текущего слайда");
              return;
            }

            // Получаем id слайда и ищем данные в базе
            const photoId = currentSlide.data?.element?.getAttribute("data-id");
            const photoData = database?.gallery?.dark_side?.page.find(
              (img) => String(img.id) === String(photoId)
            );

            if (!photoData) {
              console.error("Данные для фото не найдены");
              return;
            }

            // Создать и отобразить всплывающее окно
            const popupContainer = document.createElement("div");
            popupContainer.className = styles.popupContainer;
            // popupContainer.style.position = "fixed";
            // popupContainer.style.top = "50%";
            // popupContainer.style.left = "50%";
            // popupContainer.style.transform = "translate(-50%, -50%)";
            // popupContainer.style.zIndex = "2147483647"; // Самый высокий z-index
            // popupContainer.style.backgroundColor = "white";
            // popupContainer.style.padding = "20px";
            // popupContainer.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            // popupContainer.style.borderRadius = "8px";
            // popupContainer.style.maxWidth = "90%";
            // popupContainer.style.textAlign = "center";

            popupContainer.innerHTML = `
            <h3 class="${styles.popupTitle}">Информация о фото</h3>
            <p class="${styles.popupDescription}"><strong>Описание:</strong> ${photoData.name[locale]}</p>
            <p class="${styles.popupDescription}"><strong>Источник:</strong> ${photoData.description[locale]}</p>
            <button class="${styles.closePopupButton}" id="close-popup">
              Закрыть
            </button>
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
      {database?.gallery?.dark_side?.page.map((image, index) => (
        <a
          className={styles.image_Link}
          key={index}
          href={image.src}
          data-pswp-width={image.width}
          data-pswp-height={image.height}
          data-id={image.id}
        >
          <Tooltip
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">{image.name[locale]}</div>
                <div className="text-tiny">{image.description[locale]}</div>
              </div>
            }
          >
            <span className={styles.Tooltip}>i</span>
          </Tooltip>
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
          {/* <label htmlFor={image.id} className={styles.image_description}>
            {image.description[locale]}
          </label> */}
        </a>
      ))}
    </div>
  );
}
