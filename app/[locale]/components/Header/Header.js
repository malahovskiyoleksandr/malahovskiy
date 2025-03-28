"use client";

import React from "react";
import Link from "next/link";
import styles from "./header.module.scss";
import LanguageChanger from "../LanguageChanger";
import { useIntl } from "react-intl";
import Image from "next/image";
import Logo from "@/public/icons/logo.png";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const menu_item = [
  {
    uk: {
      name: "ГОЛОВНА",
    },
    en: {
      name: "HOME",
    },
    de: {
      name: "HEIM",
    },
    href: "/home",
  },
  {
    uk: {
      name: "ГАЛЕРЕЯ",
    },
    en: {
      name: "GALLERY",
    },
    de: {
      name: "GALERIE",
    },
    href: "/gallery",
  },
  {
    uk: {
      name: "ПОДІЇ",
    },
    en: {
      name: "EVENTS",
    },
    de: {
      name: "VERANSTALTUNGEN",
    },
    href: "/events",
  },
];

export default function Header() {
  const router = useRouter();
  const intl = useIntl();
  const locale = intl.locale;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        (event.ctrlKey && event.key.toLowerCase() === "q") ||
        (event.ctrlKey && event.key === "й")
      ) {
        event.preventDefault();
        console.log("admin");
        router.push("/admin");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [router]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);
  

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo_box}>
        <button
          className={`${styles.burger_btn} sm:hidden`}
          onClick={toggleMenu}
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>
        <Link href="/home" color="foreground" className={styles.link_logo}>
          <Image
            className={styles.image}
            alt="logo"
            src={Logo}
            quality={100}
            priority={true}
            fill={false}
            sizes="100%"
          />
        </Link>
      </div>
      <nav className={styles.menu_nav}>
        <ul className={`${styles.items_list} hidden sm:flex`}>
          {menu_item.map((item, index) => (
            <li key={index} className={styles.item}>
              <Link color="foreground" href={item.href} className={styles.item_link}>
                {item[locale].name}
              </Link>
            </li>
          ))}
        </ul>
        <LanguageChanger />
      </nav>
      <nav className={`${styles.submenu_nav} ${isMenuOpen ? styles.submenu_nav_open : styles.submenu_nav_closed}`}>
        <ul className={styles.subItems_list}>
          {menu_item.map((item, index) => (
            <li key={index} className={styles.subItem}>
              <Link
                color="foreground"
                href={item.href}
                className={styles.subItem_link}
                onClick={toggleMenu}
              >
                {item[locale].name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
