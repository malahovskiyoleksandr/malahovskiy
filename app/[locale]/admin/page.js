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

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

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

  const handleChange = async (e, path) => {
    const { value } = e.target;
    setDatabase((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let target = updated;

      // Доступ к целевому объекту
      keys.slice(0, -1).forEach((key) => {
        if (target[key] === undefined) {
          target[key] = {}; // Убедитесь, что путь существует
        }
        target = target[key];
      });

      target[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleAddEvent = async (path, newItem) => {
    const confirmAdd = confirm("Добавити картину?");

    if (confirmAdd) {
      setDatabase((prev) => {
        const updated = { ...prev };
        const keys = path.split(".");
        let target = updated;

        keys.slice(0, -1).forEach((key) => {
          if (!target[key]) {
            target[key] = {};
          }
          target = target[key];
        });

        const arrayKey = keys[keys.length - 1];
        if (!Array.isArray(target[arrayKey])) {
          target[arrayKey] = [];
        }

        // Вычисляем максимальный id
        const currentIds = target[arrayKey].map((item) => item.id || 0);
        const maxId = currentIds.length > 0 ? Math.max(...currentIds) : 0;

        // Присваиваем новый порядковый id
        newItem.id = maxId + 1;

        // Добавляем новый элемент в начало массива
        target[arrayKey].unshift(newItem);

        // Логируем действие
        if (!updated.logs) {
          updated.logs = []; // Создаем массив логов, если его нет
        }

        // Добавляем новый лог в начало массива
        updated.logs.unshift({
          timestamp: new Date().toISOString(),
          action: "Добавление",
          target: path,
          details: `Доданий новий елемент: ${JSON.stringify(newItem)}`,
        });

        return updated;
      });
      await handleSubmit();
    }
  };

  // const handleDeleteBlock = async (path, index) => {
  //   //Универсальная
  //   const confirmDelete = confirm(
  //     "Вы уверены, что хотите удалить этот ивент? Это действие нельзя отменить."
  //   );

  //   if (confirmDelete) {
  //     setDatabase((prev) => {
  //       const updated = { ...prev };
  //       const keys = path.split(".");
  //       let target = updated;

  //       // Доступ к целевому массиву
  //       keys.forEach((key) => {
  //         if (target[key] === undefined) {
  //           target[key] = []; // Убедимся, что массив существует
  //         }
  //         target = target[key];
  //       });

  //       // Удаление элемента
  //       target.splice(index, 1);

  //       return updated;
  //     });
  //     await handleSubmit();
  //   }
  // };

  const handleDeleteBlock = async (path, index) => {
    const confirmDelete = confirm(
      "Вы уверены, что хотите удалить этот элемент? Это действие нельзя отменить."
    );

    if (confirmDelete) {
      setDatabase((prev) => {
        const updated = { ...prev };
        const keys = path.split(".");
        let target = updated;

        // Доступ к целевому массиву
        keys.slice(0, -1).forEach((key) => {
          if (target[key] === undefined) {
            target[key] = []; // Убедимся, что массив существует
          }
          target = target[key];
        });

        const arrayKey = keys[keys.length - 1];

        if (!Array.isArray(target[arrayKey])) {
          console.error(`Target at path "${path}" is not an array.`);
          return prev;
        }

        // Сохраняем элемент перед удалением для лога
        const deletedItem = target[arrayKey][index];

        // Удаление элемента
        target[arrayKey].splice(index, 1);

        // Логируем удаление
        if (!updated.logs) {
          updated.logs = []; // Создаем массив логов, если его нет
        }

        updated.logs.unshift({
          timestamp: new Date().toISOString(),
          action: "Удаление",
          target: path,
          details: `Удалён элемент с id ${
            deletedItem.id
          }, данные: ${JSON.stringify(deletedItem)}`,
        });

        return updated;
      });

      // Отправляем обновленные данные
      await handleSubmit();
    }
  };

  const handleMoveBlock = (path, index, direction) => {
    //Универсальная
    setDatabase((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let target = updated;

      // Доступ к целевому массиву
      keys.forEach((key) => {
        if (target[key] === undefined) {
          target[key] = []; // Убедимся, что массив существует
        }
        target = target[key];
      });

      // Проверяем границы перемещения
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= target.length) {
        return prev; // Ничего не изменяем, если перемещение выходит за границы
      }

      // Перемещение элемента
      const temp = target[index];
      target[index] = target[targetIndex];
      target[targetIndex] = temp;

      return updated;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      filePath: "data/database.json",
      fileContent: JSON.stringify(database, null, 2),
      commitMessage: "Изменения через админ-панель",
    };

    try {
      const response = await fetch("/api/github-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Ошибка при обновлении данных");
      }

      const result = await response.json();
      console.log("Изменения успешно сохранены:", result);
    } catch (error) {
      console.error("Ошибка сохранения:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLog = (action, target, details) => {
    setDatabase((prev) => {
      const updated = { ...prev };

      if (!updated.logs) {
        updated.logs = [];
      }

      updated.logs.push({
        timestamp: new Date().toISOString(),
        action, // Тип действия: "Добавление", "Удаление", "Обновление"
        target, // Цель действия: путь или объект
        details, // Подробности
      });

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
          Вийти
        </Button>
      </header>

      <div className={styles.main}>
        <Tabs aria-label="Админ Панель">
          {/* Редактирование главной страницы */}
          <Tab key="home" title="Головна">
            <Card>
              <CardBody>
                <Tabs aria-label="Виды картин">
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
            <Card>
              <CardBody>
                <Tabs aria-label="Галерея">
                  {database.gallery &&
                    Object.entries(database.gallery).map(
                      ([key, value], index) => (
                        <Tab
                          key={key}
                          title={key}
                          className={styles.gallery_Tab}
                        >
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
                                      <Tab
                                        key={lang}
                                        title={lang.toUpperCase()}
                                      >
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
                                className={styles.description_events}
                              >
                                {value.description &&
                                  Object.entries(value.description).map(
                                    ([lang, value], index) => (
                                      <Tab
                                        key={lang}
                                        title={lang.toUpperCase()}
                                      >
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
                              <div className={styles.tab_images_box}>
                                <Button
                                  className={styles.imageSection}
                                  onClick={() =>
                                    handleAddEvent(`gallery.${key}.page`, {
                                      name: {
                                        uk: "Новий",
                                        en: "New",
                                        de: "Neu",
                                      },
                                      description: {
                                        uk: "Опис",
                                        en: "Description",
                                        de: "Beschreibung",
                                      },
                                      src: "/gallery/industrial/1_SCRUBBER.jpg",
                                      width: 1000,
                                      height: 1000,
                                    })
                                  }
                                >
                                  Додати нове зображення
                                </Button>
                                {value.page.map((image, index) => (
                                  <div
                                    key={index}
                                    className={styles.imageSection}
                                  >
                                    <div className={styles.image_box}>
                                      <Image
                                        className={styles.image}
                                        // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                                        // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                                        alt={image.name.en}
                                        src={image.src}
                                        // placeholder="blur" // размытие заднего фона при загрузке картинки
                                        // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
                                        quality={10} //качество картнки в %
                                        priority={true} // если true - loading = 'lazy' отменяеться
                                        // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
                                        fill={true} //заставляет изображение заполнять родительский элемент
                                        // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
                                        sizes="100%"
                                        // width={100} // задать правильное соотношение сторон адаптивного изображения
                                        // height={100}
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
                                    <Tabs //name, description
                                      size="md"
                                      radius="sm"
                                      className={styles.name_description_block}
                                      aria-label="Таби языковые"
                                      placement="top"
                                    >
                                      {image.name &&
                                        Object.entries(image.name).map(
                                          ([lang, nameValue]) => (
                                            <Tab key={lang} title={lang}>
                                              <Card
                                                style={
                                                  {
                                                    // width: "18rem"
                                                  }
                                                }
                                              >
                                                <CardBody>
                                                  <div
                                                    className={
                                                      styles.imageSection_input_textarea__box
                                                    }
                                                  >
                                                    <Input
                                                      classNames={{
                                                        base: "max-w-xs",
                                                        input:
                                                          "resize-y min-h-[10px]",
                                                      }}
                                                      className={
                                                        styles.imageSection_input
                                                      }
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
                                                      className="max-w-xs"
                                                      // className={
                                                      //   styles.image_imageSection_textarea
                                                      // }
                                                      label={`Описание (${lang.toUpperCase()})`}
                                                      value={
                                                        image.description[lang]
                                                      }
                                                      onChange={(e) =>
                                                        handleChange(
                                                          e,
                                                          `gallery.${key}.page.${index}.description.${lang}`
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </CardBody>
                                              </Card>
                                            </Tab>
                                          )
                                        )}
                                    </Tabs>
                                    <h3>id:{image.id}</h3>
                                    <div className={styles.block_actions}>
                                      <div
                                        className={styles.block_actions_add_del}
                                      >
                                        <Button
                                          color="success"
                                          onClick={handleSubmit}
                                          disabled={isSubmitting}
                                        >
                                          {isSubmitting
                                            ? "Збереження..."
                                            : "Зберегти зміни"}
                                        </Button>
                                        <Button
                                          color="danger"
                                          onClick={() =>
                                            handleDeleteBlock(
                                              `gallery.${key}.page`,
                                              index
                                            )
                                          }
                                          // style={{
                                          //   width: "100%"
                                          // }}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                      <div
                                        className={styles.block_actions_up_dwn}
                                      >
                                        <Button
                                          onClick={() =>
                                            handleMoveBlock(
                                              `gallery.${key}.page`,
                                              index,
                                              "up"
                                            )
                                          }
                                        >
                                          Up
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            handleMoveBlock(
                                              `gallery.${key}.page`,
                                              index,
                                              "down"
                                            )
                                          }
                                        >
                                          Down
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardBody>
                          </Card>
                        </Tab>
                      )
                    )}
                </Tabs>
              </CardBody>
            </Card>
          </Tab>

          {/* События */}
          <Tab key="events" title="Заходи" className={styles.events}>
            <Card>
              <CardBody>
                <section className={styles.events_container}>
                  <Button
                    className={styles.buttonAdd}
                    onClick={() =>
                      handleAddEvent(`events`, {
                        title: {
                          uk: "Новий",
                          en: "New",
                          de: "Neu",
                        },
                        date: Date.now(),
                        main_image: "/gallery/industrial/1_SCRUBBER.jpg",
                        content: [],
                      })
                    }
                  >
                    Додати новий івент
                  </Button>
                  {database.events.map((event, index) => (
                    <div key={index} className={styles.events_box}>
                      <Link
                        className={styles.event_link}
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
                        <h3 className={styles.event_data}>id {event.id}</h3>
                      </Link>
                      <Button
                        color="danger"
                        className={styles.delete_button}
                        onClick={() => handleDeleteBlock(`events`, index)}
                      >
                        Видалити
                      </Button>
                    </div>
                  ))}
                </section>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="logs" title="История действий">
            <Card>
              <CardBody>
                <h2>История действий</h2>
                <div className={styles.logs}>
                  {database.logs && database.logs.length > 0 ? (
                    database.logs.map((log, index) => (
                      <div key={index} className={styles.logItem}>
                        <p>
                          <strong>Время:</strong>{" "}
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                        <p>
                          <strong>Действие:</strong> {log.action}
                        </p>
                        <p>
                          <strong>Цель:</strong> {log.target}
                        </p>
                        <p>
                          <strong>Подробности:</strong> {log.details}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>Логи отсутствуют.</p>
                  )}
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
