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
import Alert from "./Alert.js";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

async function uploadImageToGitHub(path, file) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async (event) => {
      try {
        const filePath = `public/images/${path}/${file.name}`;
        const fileContent = event.target.result.split(",")[1]; // Получаем Base64 без префикса
        // console.log(event.target)
        const commitMessage = `Добавлено изображение: ${file.name}`;

        const response = await fetch("/api/github-upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filePath, fileContent, commitMessage }),
        });

        if (!response.ok) {
          throw new Error("Ошибка загрузки изображения");
        }

        const data = await response.json();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);

    // Читаем файл как Base64
    reader.readAsDataURL(file);
  });
}

export default function AdminPage({ params, onUpload }) {
  const locale = params.locale;
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [database, setDatabase] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleAddEvent = async (path, newItem, item) => {
    const confirmAdd = confirm(`Додати ${item}?`);

    if (confirmAdd) {
      // setIsUploading(true)
      try {
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
      } catch (error) {
        console.error("Помилка при додаваннi:", error);
        alert("Помилка видалення!");
      } finally {
        // setIsUploading(false); // Снимаем состояние ожидания
      }
    }
  };

  const handleDeleteBlock = async (path, index) => {
    const confirmDelete = confirm(
      "Ви впевнені, що хочете видалити цей елемент? Цю дію не можна скасувати."
    );

    if (confirmDelete) {
      // setIsRemoving(true); // Включаем состояние ожидания

      try {
        // Обновляем состояние базы данных
        setDatabase((prev) => {
          const updated = { ...prev };
          const keys = path.split(".");
          let target = updated;

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

        // Автоматически сохраняем изменения
        await handleSubmit();
      } catch (error) {
        console.error("Помилка при видаленнi:", error);
        alert("Помилка видалення!");
      } finally {
        // setIsRemoving(false); // Снимаем состояние ожидания
      }
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

  const handleFileChange = (event) => {
    // console.log(event.target.files[0].name);
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadAndUpdateDB = async (pathImg, pathDB) => {
    if (!selectedFile) {
      alert("Выберите файл!");
      return;
    }
    setIsUploading(true);
    try {
      // Загрузка изображения на GitHub
      const uploadResult = await uploadImageToGitHub(pathImg, selectedFile);

      // Формирование нового пути к изображению
      const newImagePath = `https://raw.githubusercontent.com/malahovskiyoleksandr/malahovskiy/main/public/images/${pathImg}/${selectedFile.name}`;

      // Обновление базы данных
      setDatabase((prev) => {
        const updated = { ...prev };
        const keys = pathDB.split(".");
        let target = updated;

        // Доступ к целевому объекту
        keys.slice(0, -1).forEach((key) => {
          if (!target[key]) target[key] = {};
          target = target[key];
        });

        target[keys[keys.length - 1]] = newImagePath; // Устанавливаем новый путь
        return updated;
      });
      handleSubmit();
      alert("Файл успешно загружен и база обновлена!");
    } catch (error) {
      console.error("Ошибка загрузки или обновления базы:", error.message);
      alert("Ошибка загрузки файла или обновления базы данных");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImageFromGitHubAndDB = async (imagePath, dbPath) => {
    const confirmDelete = confirm("Видалити фото?");

    if (confirmDelete) {
      try {
        const filePath = imagePath.replace(
          "https://raw.githubusercontent.com/malahovskiyoleksandr/malahovskiy/main/",
          ""
        );

        // Удаление файла из GitHub
        const response = await fetch("/api/github-delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filePath }),
        });

        if (!response.ok) {
          throw new Error("Ошибка удаления файла из репозитория");
        }

        // Удаление ссылки из базы данных
        setDatabase((prev) => {
          const updated = { ...prev };
          const keys = dbPath.split(".");
          let target = updated;

          keys.slice(0, -1).forEach((key) => {
            if (!target[key]) target[key] = {};
            target = target[key];
          });

          target[keys[keys.length - 1]] = ""; // Очищаем значение
          return updated;
        });

        await handleSubmit(); // Сохранение изменений в базе данных
        alert("Файл успешно удален!");
      } catch (error) {
        console.error("Ошибка удаления файла:", error.message);
        alert("Ошибка удаления файла или обновления базы данных");
      }
    }
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
          <Tab key="home" className={styles.home_page} title="ГОЛОВНА">
            <Card>
              <CardBody>
                <Tabs aria-label="industrial,portraits,darkside">
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
                <Button
                  color="success"
                  onClick={handleSubmit}
                  isDisabled={isSubmitting}
                >
                  {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                </Button>
                <div className={styles.images_box}>
                  <div className={styles.mainPhoto_home}>
                    {database.home.main_image.src ? ( // Проверяем, есть ли ссылка на изображение
                      <Image
                        src={database.home.main_image.src}
                        alt="Main Image"
                        width={300}
                        height={200}
                      />
                    ) : (
                      <p>Изображение отсутствует</p> // Альтернативный контент
                    )}
                    <div>
                      <Button
                        color="danger"
                        onClick={() =>
                          deleteImageFromGitHubAndDB(
                            database.home.main_image.src, // Путь к изображению
                            "home.main_image.src" // Путь в базе данных
                          )
                        }
                        isDisabled={!database.home.main_image.src}
                      >
                        Видалити
                      </Button>
                      <Input
                        className={styles.input_downloadFile}
                        type="file"
                        onChange={handleFileChange}
                        // label=""
                      />
                      <Button
                        className={styles.button_downloadFile}
                        color="success"
                        onClick={() =>
                          handleUploadAndUpdateDB(
                            "home_page",
                            "home.main_image.src"
                          )
                        }
                        isDisabled={isUploading}
                      >
                        {isUploading ? "Загрузка..." : "Загрузить файл"}
                      </Button>
                    </div>
                  </div>
                  <div className={styles.backround_home}>
                    <Image
                      src={database.home.background_image.src}
                      alt="background_image"
                      width={300}
                      height={200}
                    />
                    <div>
                      <Input
                        className={styles.input_downloadFile}
                        type="file"
                        onChange={handleFileChange}
                        // label=""
                      />
                      <Button
                        className={styles.button_downloadFile}
                        color="success"
                        onClick={() =>
                          handleUploadAndUpdateDB(
                            "home_page",
                            `home.background_image.src`
                          )
                        }
                        isDisabled={isUploading}
                      >
                        {isUploading ? "Загрузка..." : "Загрузить файл"}
                      </Button>
                    </div>
                  </div>
                </div>
                {/* <Input
                  className={styles.block_type_image__input}
                  label="Розташування зображення"
                  value={database.home.main_image.src}
                  onChange={(e) => handleChange(e, `home.main_image.src`)}
                /> */}
              </CardBody>
            </Card>
          </Tab>

          {/* Редактирование галереи */}
          <Tab key="gallery" title="ГАЛЕРЕЯ" className={styles.gallery}>
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
                              <Button
                                color="success"
                                onClick={handleSubmit}
                                isDisabled={isSubmitting}
                              >
                                {isSubmitting
                                  ? "Збереження..."
                                  : "Зберегти зміни"}
                              </Button>

                              <div className={styles.mainPhoto_gallery}>
                                <div className={styles.mainPhoto_box}>
                                  {value.src ? (
                                    <Image
                                      className={styles.image}
                                      // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                                      // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                                      alt={value.name.en}
                                      src={value.src}
                                      // placeholder="blur" // размытие заднего фона при загрузке картинки
                                      // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
                                      quality={10} //качество картнки в %
                                      priority={true} // если true - loading = 'lazy' отменяеться
                                      // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
                                      fill={false} //заставляет изображение заполнять родительский элемент
                                      // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
                                      sizes="100%"
                                      width={300} // задать правильное соотношение сторон адаптивного изображения
                                      height={200}
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
                                  ) : (
                                    <p>Изображение отсутствует</p> // Альтернативный контент
                                  )}
                                </div>
                                <Button
                                  color="danger"
                                  onClick={() =>
                                    deleteImageFromGitHubAndDB(
                                      value.src, // Путь к изображению
                                      `gallery.${key}.src` // Путь в базе данных
                                    )
                                  }
                                  isDisabled={!value.src || isSubmitting}
                                >
                                  Видалити
                                </Button>
                                <div className={styles.downloadImage_block}>
                                  <Input
                                    className={styles.input_downloadFile}
                                    type="file"
                                    onChange={handleFileChange}
                                    // label=""
                                  />
                                  <Button
                                    className={styles.button_downloadFile}
                                    color="success"
                                    onClick={() =>
                                      handleUploadAndUpdateDB(
                                        `gallery`,
                                        `gallery.${key}.src`
                                      )
                                    }
                                    isDisabled={isUploading}
                                  >
                                    {isUploading
                                      ? "Загрузка..."
                                      : "Загрузить файл"}
                                  </Button>
                                </div>

                                {/* <div className={styles.Imagelocation_block}>
                                  <Input
                                    className={styles.block_type_image__input}
                                    label="Розташування зображення"
                                    value={database.gallery[key].src}
                                    onChange={(e) =>
                                      handleChange(e, `gallery.${[key]}.src`)
                                    }
                                  />
                                </div> */}
                              </div>

                              {/* Редактирование изображений */}
                              <div className={styles.tab_images_box}>
                                <Button
                                  className={styles.imageSection}
                                  onClick={() =>
                                    handleAddEvent(
                                      `gallery.${key}.page`,
                                      {
                                        name: {
                                          uk: "Нове зображення",
                                          en: "",
                                          de: "",
                                        },
                                        material: "",
                                        size: "",
                                        date: "",
                                        description: {
                                          uk: "",
                                          en: "",
                                          de: "",
                                        },
                                        src: "",
                                        width: 1000,
                                        height: 1000,
                                      },
                                      "нове зображення"
                                    )
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
                                      {image.src ? (
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
                                      ) : (
                                        <p>Изображение отсутствует</p> // Альтернативный контент
                                      )}
                                    </div>
                                    <Button
                                      color="danger"
                                      onClick={() =>
                                        deleteImageFromGitHubAndDB(
                                          image.src, // Путь к изображению
                                          `gallery.${key}.page.${index}.src` // Путь в базе данных
                                        )
                                      }
                                      isDisabled={!image.src || isSubmitting}
                                    >
                                      Видалити фото
                                    </Button>
                                    <div>
                                      <Input
                                        className={styles.input_downloadFile}
                                        type="file"
                                        onChange={handleFileChange}
                                        // label=""
                                      />
                                      <Button
                                        className={styles.button_downloadFile}
                                        color="success"
                                        onClick={() =>
                                          handleUploadAndUpdateDB(
                                            `gallery/${key}`,
                                            `gallery.${key}.page.${index}.src`
                                          )
                                        }
                                        isDisabled={isUploading || isSubmitting}
                                      >
                                        {isUploading
                                          ? "Загрузка..."
                                          : "Загрузить файл"}
                                      </Button>
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
                                              <Card>
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
                                                      // className={
                                                      //   styles.imageSection_input
                                                      // }
                                                      label={`Назва (${lang.toUpperCase()})`}
                                                      value={nameValue}
                                                      onChange={(e) =>
                                                        handleChange(
                                                          e,
                                                          `gallery.${key}.page.${index}.name.${lang}`
                                                        )
                                                      }
                                                    />
                                                    <Input
                                                      classNames={{
                                                        base: "max-w-xs",
                                                        input:
                                                          "resize-y min-h-[10px]",
                                                      }}
                                                      label={`Матерiал`}
                                                      value={image.material}
                                                      onChange={(e) =>
                                                        handleChange(
                                                          e,
                                                          `gallery.${key}.page.${index}.material`
                                                        )
                                                      }
                                                    />
                                                    <Input
                                                      classNames={{
                                                        base: "max-w-xs",
                                                        input:
                                                          "resize-y min-h-[10px]",
                                                      }}
                                                      label={`Розмiр`}
                                                      value={image.size}
                                                      onChange={(e) =>
                                                        handleChange(
                                                          e,
                                                          `gallery.${key}.page.${index}.size`
                                                        )
                                                      }
                                                    />
                                                    <Input
                                                      classNames={{
                                                        base: "max-w-xs",
                                                        input:
                                                          "resize-y min-h-[10px]",
                                                      }}
                                                      label={`Дата`}
                                                      value={image.date}
                                                      onChange={(e) =>
                                                        handleChange(
                                                          e,
                                                          `gallery.${key}.page.${index}.date`
                                                        )
                                                      }
                                                    />
                                                    <Textarea
                                                      className="max-w-xs"
                                                      // className={
                                                      //   styles.image_imageSection_textarea
                                                      // }
                                                      label={`Опис (${lang.toUpperCase()})`}
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
                                                    {/* <Input
                                                      classNames={{
                                                        base: "max-w-xs",
                                                        input:
                                                          "resize-y min-h-[10px]",
                                                      }}
                                                      // className={
                                                      //   styles.imageSection_input
                                                      // }
                                                      label={`URL картинки`}
                                                      value={image.src || ""}
                                                      onChange={(e) =>
                                                        handleChange(
                                                          e,
                                                          `gallery.${key}.page.${index}.src`
                                                        )
                                                      }
                                                    /> */}
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
                                          isDisabled={isSubmitting}
                                        >
                                          {isSubmitting
                                            ? "Збереження..."
                                            : "Зберегти зміни"}
                                        </Button>
                                        <Button
                                          color="danger"
                                          onClick={() => {
                                            deleteImageFromGitHubAndDB(
                                              image.src, // Путь к изображению
                                              `gallery.${key}.page.${index}.src` // Путь в базе данных
                                            );
                                            handleDeleteBlock(
                                              `gallery.${key}.page`,
                                              index
                                            );
                                          }}
                                          // isDisabled={isSubmitting}
                                        >
                                          Видалити зображення
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
          <Tab key="events" title="ПОДІЇ" className={styles.events}>
            <Card>
              <CardBody>
                <section className={styles.events_container}>
                  <Button
                    color="success"
                    className={styles.buttonAdd}
                    onClick={() =>
                      handleAddEvent(
                        `events`,
                        {
                          // id: ,
                          title: {
                            uk: "Новий",
                            en: "new",
                            de: "",
                          },
                          date: "",
                          main_image: "",
                          content: [],
                        },
                        "новий захiд"
                      )
                    }
                    isDisabled={isSubmitting}
                  >
                    Додати новий захід
                  </Button>
                  {database.events.map((event, index) => (
                    <div key={index} className={styles.events_box}>
                      <Link
                        className={styles.event_link}
                        href={`/admin/${generateSlug(event.title.en)}`}
                      >
                        <div className={styles.image_box}>
                          {event.main_image ? (
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
                          ) : (
                            <p>Изображение отсутствует</p> // Альтернативный контент
                          )}
                        </div>
                        <h3 className={styles.title}>{event.title[locale]}</h3>
                      </Link>
                      <h3 className={styles.event_data}>id {event.id}</h3>
                      <Button
                        color="danger"
                        onClick={() =>
                          deleteImageFromGitHubAndDB(
                            event.main_image, // Путь к изображению
                            `events.${event}.main_image` // Путь в базе данных
                          )
                        }
                        isDisabled={!event.main_image || isSubmitting}
                        // isDisabled={!event.main_image}
                      >
                        Видалити картинку
                      </Button>
                      <div>
                        <Input
                          className={styles.input_downloadFile}
                          type="file"
                          onChange={handleFileChange}
                          // label=""
                        />
                        <Button
                          className={styles.button_downloadFile}
                          color="success"
                          onClick={() =>
                            handleUploadAndUpdateDB(
                              `events/id${index + 1}`,
                              `events.${index}.main_image`
                            )
                          }
                          isDisabled={isSubmitting}
                        >
                          {isUploading
                            ? "Завантаження..."
                            : "Завантажити картинку"}
                        </Button>
                      </div>
                      <Input
                        classNames={{
                          base: "max-w-xs",
                          input: "resize-y min-h-[10px]",
                        }}
                        label={`Дата`}
                        value={event.date}
                        onChange={(e) =>
                          handleChange(e, `events.${index}.date`)
                        }
                      />
                      <Button
                        color="success"
                        onClick={handleSubmit}
                        isDisabled={isSubmitting}
                      >
                        {isSubmitting ? "Збереження..." : "Зберегти зміни"}
                      </Button>
                      <Button
                        color="danger"
                        className={styles.delete_button}
                        onClick={() => {
                          deleteImageFromGitHubAndDB(
                            event.main_image, // Путь к изображению
                            `events.${event}.main_image` // Путь в базе данных
                          );
                          handleDeleteBlock(`events`, index);
                        }}
                        // onClick={() => handleDeleteBlock(`events`, index)}
                        isDisabled={isSubmitting}
                      >
                        Видалити захiд
                      </Button>
                    </div>
                  ))}
                </section>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="logs" title="IСТОРIЯ ДIЙ">
            <Card>
              <CardBody>
                <h2>Iстория дiй</h2>
                <div className={styles.logs}>
                  {database.logs && database.logs.length > 0 ? (
                    database.logs.map((log, index) => (
                      <div key={index} className={styles.logItem}>
                        <p>
                          <strong>Час:</strong>{" "}
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                        <p>
                          <strong>Дiя:</strong> {log.action}
                        </p>
                        <p>
                          <strong>Цiль:</strong> {log.target}
                        </p>
                        <p>
                          <strong>Подробицi:</strong> {log.details}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>Логи вiдсутнi.</p>
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
