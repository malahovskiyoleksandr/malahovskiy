"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./admin.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Textarea,
  Tabs,
  Tab,
  Card,
  CardBody,
  Input,
  Button,
  Spinner,
} from "@nextui-org/react";

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export default function AdminPage({ params }) {
  const locale = params.locale;
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [database, setDatabase] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Проверка авторизации
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/protected", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setIsLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  // Загрузка данных из GitHub
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/github-get");
        if (!response.ok) {
          throw new Error("Помилка завантаження даних");
        }
        const data = await response.json();
        setDatabase(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Ошибка:", error.message);
      }
    };

    loadData();
  }, []);

  const handleChange = (e, path) => {
    const { value } = e.target;

    setDatabase((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let target = updated;

      keys.slice(0, -1).forEach((key) => {
        target = target[key];
      });

      target[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
  
    try {
      const payload = {
        filePath: "data/database.json",
        fileContent: JSON.stringify(database, null, 2),
        commitMessage: "Добавлен новый ивент через админ-панель",
      };
  
      const response = await fetch("/api/github-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Ошибка при сохранении данных");
      }
  
      const result = await response.json();
      console.log("Изменения успешно сохранены:", result);
    } catch (error) {
      console.error("Ошибка сохранения:", error.message);
    } finally {
      setIsSubmitting(false);
    };
  };
  

  const handleAddEvent = () => {
    setDatabase((prev) => {
      const updated = { ...prev };
      const newEvent = {
        title: { uk: "Новий івент", en: "New Event", de: "Neues Ereignis" },
        date: "2024-01-01",
        main_image: "/path/to/default-image.jpg",
        content: [],
      };
  
      updated.events.push(newEvent);
      const newEventIndex = updated.events.length - 1;
  
      // Перенаправляем на страницу редактирования
      router.push(`/admin/${generateSlug(newEvent.title.en)}`);
  
      return updated;
    });
  };
  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[95vh]">
        <Spinner color="warning" label="Loading" labelColor="warning" />
      </div>
    );
  }

  if (!database) {
    return (
      <div className="flex items-center justify-center h-[95vh]">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className={styles.adminPanel}>
      <header className={styles.header}>
        {user && (
          <div className={styles.profile}>
            <div>
              <h2>User: {user.email}</h2>
              <p>Role: {user.role}</p>
            </div>
          </div>
        )}
        <Button
          color="danger"
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          Выйти
        </Button>
      </header>

      <div className={styles.main}>
        <Tabs aria-label="Админ Панель">
          {/* Редактирование главной страницы */}
          <Tab key="home" title="Головна">
            <Card>
              <CardBody>
                <Tabs aria-label="Localized Titles">
                  {["uk", "en", "de"].map((lang) => (
                    <Tab key={lang} title={lang.toUpperCase()}>
                      <Card>
                        <CardBody>
                          <Input
                            label={`Назва (${lang.toUpperCase()})`}
                            value={database.home.name[lang]}
                            onChange={(e) =>
                              handleChange(e, `home.name.${lang}`)
                            }
                          />
                          <Textarea
                            label={`Описание (${lang.toUpperCase()})`}
                            value={database.home.description[lang]}
                            onChange={(e) =>
                              handleChange(e, `home.description.${lang}`)
                            }
                          />
                        </CardBody>
                      </Card>
                    </Tab>
                  ))}
                </Tabs>
                <Image
                  src={database.home.main_image.src}
                  alt="Main Image"
                  width={300}
                  height={200}
                />
                <Input
                  className={styles.block_type_image__input}
                  label="Розташування зображення"
                  value={database.home.main_image.src}
                  onChange={(e) => handleChange(e, `home.main_image.src`)}
                />
                <Button
                  color="success"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </CardBody>
            </Card>
          </Tab>

          {/* Редактирование галереи */}
          <Tab key="gallery" title="Галерея" className={styles.gallery}>
            <Tabs aria-label="Галерея">
              {database.gallery &&
                Object.entries(database.gallery).map(([key, value], index) => (
                  <Tab key={index} title={key}>
                    <Card>
                      <CardBody>
                        <h2>{key}</h2>
                        <Tabs
                          aria-label="Localized Titles"
                          className={styles.name_events}
                        >
                          {value.name &&
                            Object.entries(value.name).map(
                              ([lang, value], index) => (
                                <Tab key={lang} title={lang.toUpperCase()}>
                                  <Card>
                                    <CardBody>
                                      <Input
                                        key={index}
                                        label={`Название (${lang.toUpperCase()})`}
                                        value={value}
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            `gallery.${key}.name.${lang}`
                                          )
                                        }
                                      />
                                    </CardBody>
                                  </Card>
                                </Tab>
                              )
                            )}
                        </Tabs>
                        <Tabs
                          aria-label="Localized Titles"
                          className={styles.name_events}
                        >
                          {value.description &&
                            Object.entries(value.description).map(
                              ([lang, value], index) => (
                                <Tab key={lang} title={lang.toUpperCase()}>
                                  <Card>
                                    <CardBody>
                                      <Textarea
                                        key={index}
                                        label={`Описание (${lang.toUpperCase()})`}
                                        value={value}
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            `gallery.${key}.description.${lang}`
                                          )
                                        }
                                      />
                                    </CardBody>
                                  </Card>
                                </Tab>
                              )
                            )}
                        </Tabs>
                        {/* Редактирование изображений */}
                        <div>
                          {value.page.map((image, index) => (
                            <div key={index} className={styles.imageSection}>
                              <Image
                                src={image.src}
                                alt={image.name.en}
                                width={100}
                                height={100}
                              />
                              {image.name &&
                                Object.entries(image.name).map(
                                  ([lang, nameValue]) => (
                                    <div key={lang}>
                                      <Input
                                        label={`Название (${lang.toUpperCase()})`}
                                        value={nameValue}
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            `gallery.${key}.page.${index}.name.${lang}`
                                          )
                                        }
                                      />
                                      <Textarea
                                        label={`Описание (${lang.toUpperCase()})`}
                                        value={image.description[lang]}
                                        onChange={(e) =>
                                          handleChange(
                                            e,
                                            `gallery.${key}.page.${index}.description.${lang}`
                                          )
                                        }
                                      />
                                    </div>
                                  )
                                )}
                            </div>
                          ))}
                        </div>

                        <Button
                          color="success"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting
                            ? "Сохранение..."
                            : "Сохранить изменения"}
                        </Button>
                      </CardBody>
                    </Card>
                  </Tab>
                ))}
            </Tabs>
          </Tab>

          {/* События */}
          <Tab key="events" title="Заходи" className={styles.events}>
            <Card>
              <CardBody>
                <section className={styles.events_container}>
                  {database.events.map((event, index) => (
                    <Link
                      className={styles.event_link}
                      key={index}
                      href={`/admin/${generateSlug(event.title.en)}`}
                    >
                      <div className={styles.image_box}>
                        <Image
                          className={styles.image}
                          // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                          // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                          alt={event.title[locale]}
                          src={event.main_image}
                          // placeholder="blur" // размытие заднего фона при загрузке картинки
                          // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
                          quality={100} //качество картнки в %
                          priority={true} // если true - loading = 'lazy' отменяеться
                          // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
                          fill={true} //заставляет изображение заполнять родительский элемент
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          // width={300} // задать правильное соотношение сторон адаптивного изображения
                          // height={200}
                          style={
                            {
                              // width: "200px",
                              // height: "200px",
                              // objectFit: "cover", // Изображение масштабируется, обрезая края
                              // objectFit: "contain", // Изображение масштабируется, не обрезаясь
                              // objectPosition: "top",
                              // margin: "0 0 1rem 0",
                            }
                          }
                        />
                      </div>
                      <h3 className={styles.title}>{event.title[locale]}</h3>
                      {/* <span className={styles.event_data}>28 жовтня 2024</span> */}
                    </Link>
                  ))}
                </section>

                <Button color="success" onClick={handleAddEvent}>
                  Добавить новый ивент
                </Button>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
