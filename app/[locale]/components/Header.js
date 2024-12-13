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
import Logo from "@/public/images/logo.png";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const menu_item = [
  {
    uk: {
      name: "Головна",
    },
    en: {
      name: "Main",
    },
    de: {
      name: "Hauptsächlich",
    }, 
    href: "/home",
  },
  {
    uk: {
      name: "Галерея",
    },
    en: {
      name: "Gallery",
    },
    de: {
      name: "Galerie",
    },
    href: "/gallery",
  },
  {
    uk: {
      name: "Заходи",
    },
    en: {
      name: "Events",
    },
    de: {
      name: "Veranstaltungen",
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
        if (event.ctrlKey && event.key === "a") {
          event.preventDefault(); // Предотвращаем стандартное поведение
          console.log("admin")
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
  // Получаем данные из getMenuItems при первом рендере
  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await getMenuItems();
  //     // setMenu_itemData(data.menu_item);
  //   };
  //   fetchData();
  // }, []);

  // Если данные еще не загружены, возвращаем null или лоадер
  // if (!menu_itemData) return null;

  const locale = intl.locale;

  const handleMenuItemClick = () => {
    setIsMenuOpen(false); // Закрыть меню при клике
  };

  return (
    <Navbar
      position="static"
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className={styles.header}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="header_benu_btn sm:hidden"
        />
        <NavbarBrand>
          <Link
            href="/home"
            color="foreground"
            className="font-bold text-inherit"
          >
            <Image
              className={styles.image}
              // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
              // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
              alt={"logo"}
              src={Logo}
              // placeholder="blur" // размытие заднего фона при загрузке картинки
              // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
              quality={100}
              priority={true} // если true - loading = 'lazy' отменяеться
              // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
              fill={false} //заставляет изображение заполнять родительский элемент
              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
              sizes="100%"
              // width={50} // задать правильное соотношение сторон адаптивного изображения
              // height={50}
              style={
                {
                  width: "50px",
                  height: "50px",
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
        {/* <Link href="/admin">Admin</Link> */}
      </NavbarContent>
      <LanguageChanger />

      <NavbarMenu className={styles.items_list}>
        {menu_item.map((item, index) => (
          <NavbarMenuItem key={index}>
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
