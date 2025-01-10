"use client";
import React from "react";
// import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Импортируем компонент для иконок
import {
  faFacebook,
  faArtstation,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons"; // Импортируем нужные иконки
import styles from "./styles/footer.module.scss";

export default function Footer({ params }) {
  const { locale } = params;
  const developer = {
    name: {
      uk: "Розробник сайту: Максим Кругляк",
      en: "Website developer: Maksim Kruglyak",
      de: "Webentwickler: Maksim Kruglyak"
    }
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div className={styles.icon_box}>
          <Link
            href="https://www.facebook.com/profile.php?id=100007568640200"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faFacebook} size="2x" />
          </Link>
          <Link
            href="https://www.instagram.com/alexandr_malahovsky/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </Link>
          <Link
            href="https://www.youtube.com/@alexmalahovskyi9866/videos"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faYoutube} size="2x" />
          </Link>
          <Link
            href="https://www.artstation.com/malakhovsky"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faArtstation} size="2x" />
          </Link>
        </div>
        <span className={styles.email}>malahovskiy1404@gmail.com</span>
      </div>
      <span className={styles.rights}>
        ©2024 FPL “ARS ALTERA”. All rights reserved
      </span>
      <span className={styles.developer}>{developer.name[locale]}</span>
      {/* <span className={styles.developer}>Розробник сайту: Максим Кругляк</span> */}
    </footer>
  );
}
