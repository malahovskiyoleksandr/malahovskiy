"use client";

import { useEffect, useRef } from "react"; 
import Link from "next/link";
import Image from "next/image";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css'; // Импорт базовых стилей Swiper
import 'swiper/css/navigation'; 
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
  const swiperRef = useRef(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className={styles.galleryWrapper}>
      {/* Для ПК: горизонтальная прокрутка колесиком */}
      <div className={styles.desktopGallery}>
        <div id="gallery" className={styles.imageList}>
          {images.map((image, index) => (
            <Link
              className={styles.imageLink}
              key={index}
              href={image.src}
              data-pswp-width={image.width}
              data-pswp-height={image.height}
            >
              <Image
                id={image.id}
                className={styles.image}
                alt={image.name}
                src={image.src}
                quality={50}
                width={image.width}
                height={image.height}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Для мобильных устройств: слайдер */}
      <Swiper
        spaceBetween={10}
        slidesPerView="auto"
        centeredSlides={true}
        grabCursor={true}
        loop={true}
        ref={swiperRef}
        className={styles.mobileGallery}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Link
              className={styles.imageLink}
              href={image.src}
              data-pswp-width={image.width}
              data-pswp-height={image.height}
            >
              <Image
                id={image.id}
                className={styles.image}
                alt={image.name}
                src={image.src}
                quality={50}
                width={image.width}
                height={image.height}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
