"use client";

import { useEffect, useRef } from "react"; 
import Link from "next/link";
import Image from "next/image";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css'; // Импорт базовых стилей Swiper
import 'swiper/css/navigation'; 
import styles from "./industrial.module.scss";
import imagesData from '@/data/gallery.json';


export default function PhotoGallery() {
  const images = imagesData.gallery.industrial.page
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
