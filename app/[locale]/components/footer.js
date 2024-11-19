'use client'
import React from 'react';
// import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Импортируем компонент для иконок
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons'; // Импортируем нужные иконки
import styles from "./styles/footer.module.scss";

export default function Footer() {
  
  return (
    <footer className={styles.footer}>
      <h3 className={styles.name}>{"Name_Artist"}</h3>
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
      <span className={styles.year}>© 2024.</span>
    </footer>
  );
}