'use client'
import React from 'react';
// import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Импортируем компонент для иконок
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons'; // Импортируем нужные иконки
import styles from "./styles/footer.module.scss";

export default function Footer({ params }) {
  // const { locale } = params;
  // const developer = {
  //   name: {
  //     uk: "Розробник сайту: Максим Кругляк",
  //     en: "Website developer: Maxim Kruglyak",
  //     de: "Webentwickler: Maxim Kruglyak"
  //   }
  // }
  
  return (
    <footer className={styles.footer}>
      <div className={styles.icon_box}>
        {/* Ссылка на Facebook с иконкой */}
        <Link
          href="https://www.facebook.com/profile.php?id=100007568640200"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faFacebook} size="2x" />
        </Link>

        {/* Ссылка на Twitter с иконкой */}
        <Link
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faTwitter} size="2x" />
        </Link>
      </div>
      <span className={styles.rights}>©2024 FPL “ARS ALTERA”. All rights reserved</span>
      {/* <span className={styles.developer}>{developer.name[locale]}</span> */}
      <span className={styles.developer}>Розробник сайту: Максим Кругляк</span>
    </footer>
  );
}