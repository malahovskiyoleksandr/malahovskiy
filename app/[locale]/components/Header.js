"use client";

import React from "react";
import Link from "next/link";
import styles from "./styles/header.module.scss";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageChanger from "../components/LanguageChanger";
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

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Функция для обработки нажатия клавиш
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Проверяем, нажаты ли Ctrl и A
      if ((event.ctrlKey && event.key.toLowerCase() === "q") || (event.ctrlKey && event.key === "й")) {
        event.preventDefault(); // Предотвращаем стандартное поведение
        console.log("admin");
        router.push("/admin"); // Перенаправляем на админку
      }
    };

    // Добавляем обработчик события нажатия клавиш
    window.addEventListener("keydown", handleKeyPress);

    // Очистка при размонтировании компонента
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [router]);

  const locale = intl.locale;

  const handleMenuItemClick = () => {
    setIsMenuOpen(false); // Закрыть меню при клике
  };

  return (
    <Navbar
      position="static"
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      // className={styles.header}
      className={`${styles.header} flex justify-between`}
      // className="flex justify-between"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className={`${styles.header_benu_btn} sm:hidden`}
        />
        <NavbarBrand>
          <Link
            href="/home"
            color="foreground"
            // className="font-bold text-inherit"
            className={`${styles.link_logo} font-bold text-inherit`}
          >
            <Image
              className={styles.image}
              alt={"logo"}
              src={Logo}
              quality={100}
              priority={true} // если true - loading = 'lazy' отменяеться
              fill={false} //заставляет изображение заполнять родительский элемент
              sizes="100%"
              style={
                {
                  // width: "50px",
                  // height: "50px",
                  // objectFit: "cover", // Изображение масштабируется, не обрезаясь
                  // objectFit: "contain", // Изображение масштабируется, не обрезаясь
                  // objectPosition: "top",
                }
              }
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menu_item.map((item, index) => (
          <NavbarItem key={index}>
            <motion.div
              whileHover={{ color: "#966600" }}
              whileTap={{ scale: 0.9 }}
            >
              <Link
                color="foreground"
                href={item.href}
                className="forn_link text-xl lg:text-lg"
                style={{
                  fontFamily: "Mariupol-Regular",
                  textTransform: "uppercase",
                }}
              >
                {item[locale].name}
              </Link>
            </motion.div>
          </NavbarItem>
        ))}
      </NavbarContent>
      <LanguageChanger />

      <NavbarMenu className={styles.items_list}>
        {menu_item.map((item, index) => (
          <NavbarMenuItem key={index} className={styles.item}>
            <Link
              color="foreground"
              // className="w-full"
              href={item.href}
              onClick={handleMenuItemClick} // Закрыть меню при клике на ссылку
            >
              {item[locale].name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}