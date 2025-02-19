"use client";

import React from "react";
import styles from "./event.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { Textarea, Button, Spinner } from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody, Input, Alert } from "@nextui-org/react";

export default function EventPage({ params }) {
  const { slug, locale } = params;
  const [database, setDatabase] = useState();
  const [fullDatabase, setFullDatabase] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventIndex, setEventIndex] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/github-get");
        if (!response.ok) {
          throw new Error("Помилка завантаження даних");
        }
        const data = await response.json();

        const index = data.events.findIndex(
          (event) => generateSlug(event.title["en"]) === slug
        );

        if (index === -1) {
          throw new Error("Event not found");
        }

        setFullDatabase(data);
        setDatabase(data.events[index]);
        setEventIndex(index);
      } catch (error) {
        console.error("Error: fetch(github-get)", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [slug]);

  useEffect(() => {
    let lightbox;

    if (typeof window !== "undefined") {
      lightbox = new PhotoSwipeLightbox({
        gallery: "#gallery",
        children: "a",
        pswpModule: () => import("photoswipe"),
        wheelToZoom: true,
      });
      lightbox.init();
    }

    return () => {
      if (lightbox) lightbox.destroy();
    };
  }, [database]);

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000); // Скрыть алерт через 3 секунды
  };

  const handleSomeAction = async (message) => {
    try {
      // Ваш код действия, например, загрузка файла
      // ...
      showAlert(message); // Показываем алерт
    } catch (error) {
      console.error("Ошибка:", error.message);
      showAlert("Ошибка при выполнении действия.");
    }
  };

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
  const updateDB = async () => {
    setIsSubmitting(true);
    try {
      // Обновляем только изменённое событие в fullDatabase
      const updatedFullDatabase = { ...fullDatabase };
      updatedFullDatabase.events[eventIndex] = database;

      const payload = {
        filePath: "data/database.json",
        fileContent: JSON.stringify(updatedFullDatabase, null, 2),
        commitMessage: `Updated event ${database.title.en} via admin panel`,
      };

      const response = await fetch("/api/github-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Успішне оновлення бази");
      } else {
        throw new Error("Failed to update data");
      }

      const result = await response.json();
    } catch (error) {
      console.error("Error saving:", error.message);
      alert("Помилка! Невдале збереження");
    } finally {
      setIsSubmitting(false);
      handleSomeAction("Успішне збереження!");
    }
  };
  const handleMoveBlock = (index, direction) => {
    setDatabase((prev) => {
      const newContent = [...prev.content];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= newContent.length) {
        return prev;
      }

      // Перемещение блоков
      const temp = newContent[index];
      newContent[index] = newContent[targetIndex];
      newContent[targetIndex] = temp;

      return { ...prev, content: newContent };
    });
  };
  const handleAddTextBlock = () => {
    setDatabase((prev) => ({
      ...prev,
      content: [
        ...prev.content,
        {
          type: "text",
          value: { uk: "", en: "", de: "" },
        },
      ],
    }));
  };
  const handleAddLinkBlock = () => {
    setDatabase((prev) => ({
      ...prev,
      content: [
        ...prev.content,
        {
          type: "link",
          value: "",
        },
      ],
    }));
  };
  const handleAddImageBlock = () => {
    setDatabase((prev) => ({
      ...prev,
      content: [
        ...prev.content,
        {
          type: "image",
          src: "",
          description: { uk: "", en: "", de: "" },
        },
      ],
    }));
  };
  const handleFileChange = (event) => {
    // console.log(event.target.files[0].name);
    setSelectedFile(event.target.files[0]);
  };

  const uploadImageToGitHub = (pathImg) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        try {
          const filePath = `public/images/${pathImg}/${selectedFile.name}`;
          const fileContent = event.target.result.split(",")[1]; // Получаем Base64 без префикса
          const commitMessage = `Добавлено изображение: ${selectedFile.name}`;

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
      reader.readAsDataURL(selectedFile);
    });
  };

  const UploadPhoto = async (DBsrcValue, pathImg, pathDB, index) => {
    if (!selectedFile) {
      alert("Выберите файл!");
      return;
    }
    const fileExists = await checkIfFileExists(pathImg, selectedFile.name);
    if (fileExists) {
      alert("Файл с таким именем уже существует!");
      return;
    }
    if (!DBsrcValue == "") {
      await deleteImgFromGitgub(DBsrcValue, pathImg);
    }
    await uploadImageToGitHub(pathImg);
    await updateImagePathInDatabase(pathImg, pathDB);
    await updateDB();
  };

  const updateImagePathInDatabase = async (pathImg, pathDB) => {
    const newImagePath = `https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/${pathImg}/${selectedFile.name}`;

    // Обновляем только изменённый путь в базе данных
    setDatabase((prev) => {
      const updated = { ...prev };
      const keys = pathDB.split(".");
      let target = updated;

      // Доступ к целевому объекту
      keys.slice(0, -1).forEach((key) => {
        if (!target[key]) target[key] = {};
        target = target[key];
      });

      // Устанавливаем новый путь
      target[keys[keys.length - 1]] = newImagePath;

      // Обновляем fullDatabase только для текущего события
      const updatedFullDatabase = { ...fullDatabase };
      updatedFullDatabase.events[eventIndex] = { ...updated };

      setFullDatabase(updatedFullDatabase);
      return updated;
    });
  };

  const checkIfFileExists = async (path, fileName) => {
    const filePath = `public/images/${path}/${fileName}`;
    const url = `/api/github-check-file`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
    });

    if (!response.ok) {
      throw new Error("Ошибка проверки файла");
    }

    const data = await response.json();
    return data.exists; // Возвращает true, если файл существует, и false, если нет
  };

  const deleteImgFromGitgub = async (pathOldImgInGithub, pathImg) => {
    const oldPhoto = pathOldImgInGithub.replace(
      `https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/${pathImg}/`,
      ""
    );
    const fileExists = await checkIfFileExists(pathImg, oldPhoto);
    if (!fileExists) {
      alert("Такого файла не существует на GitHub.");
      return;
    }
    const filePath = pathOldImgInGithub.replace(
      "https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/",
      ""
    );
    const response = await fetch("/api/github-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filePath, isDirectory: false }),
    });

    if (response.ok) {
      console.log("Успішне видалення файла з github");
    } else {
      throw new Error("Ошибка удаления файла из репозитория");
    }
  };

  const handleDeleteBlock = (index, photo) => {
    console.log(photo);
    if (photo) {
      deleteImgFromGitgub(photo, `events/id${database.id}`);
    }
    setDatabase((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  if (!database) {
    return (
      <div className="flex items-center justify-center h-[95vh]">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <section className={styles.main_block}>
      <header className={styles.header}>
        <Button
          className={styles.save_button}
          color="success"
          onPress={updateDB}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Зберегти"}
        </Button>
        {/* <div className={styles.buttons}> */}
        <Button onPress={handleAddTextBlock} color="primary">
          Додати текст
        </Button>
        <Button onPress={handleAddLinkBlock} color="primary">
          Додати силку
        </Button>
        <Button onPress={handleAddImageBlock} color="primary">
          Додати зображення
        </Button>
        {/* </div> */}
      </header>
      <div className={styles.alert}>
        {alertVisible && (
          <Alert
            color="success"
            variant="faded"
            description={alertMessage}
            title="Повідомлення"
          />
        )}
      </div>
      <div className={styles.event}>
        <Tabs aria-label="Localized Titles" className={styles.name_events}>
          {["uk", "en", "de"].map((lang, index) => (
            <Tab key={lang} title={lang.toUpperCase()}>
              <Card>
                <CardBody>
                  <Textarea
                    className={styles.name_events_textarea}
                    label={`Назва заходу (${lang.toUpperCase()})`}
                    value={database.title[lang]}
                    onChange={(e) => handleChange(e, `title.${lang}`)}
                  />
                </CardBody>
              </Card>
            </Tab>
          ))}
        </Tabs>

        <Input
          className={styles.input_date}
          label="Дата заходу"
          value={database.date}
          onChange={(e) => handleChange(e, "date")}
        />

        <div className={styles.event_content}>
          {database.content.map((block, index) => {
            if (block.type === "text") {
              return (
                <div key={index} className={styles.block_type_text}>
                  <Tabs aria-label={`Text Block ${index}`}>
                    {["uk", "en", "de"].map((lang, index_leng) => (
                      <Tab key={lang} title={lang.toUpperCase()}>
                        <Card>
                          <CardBody>
                            <Textarea
                              className={styles.block_type_text__textarea}
                              label={`Text Content (${lang.toUpperCase()})`}
                              value={block.value[lang]}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  `content.${index}.value.${lang}`
                                )
                              }
                            />
                          </CardBody>
                        </Card>
                      </Tab>
                    ))}
                  </Tabs>
                  <div className={styles.block_actions}>
                    <Button onPress={() => handleMoveBlock(index, "up")}>
                      Up
                    </Button>
                    <Button onPress={() => handleMoveBlock(index, "down")}>
                      Down
                    </Button>
                    <Button
                      color="danger"
                      onPress={() => handleDeleteBlock(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            }

            if (block.type === "link") {
              return (
                <div key={index} className={styles.block_type_text}>
                  <Textarea
                    className={styles.block_type_text__textarea}
                    label={`Link Content`}
                    value={block.value}
                    onChange={(e) =>
                      handleChange(e, `content.${index}.value`)
                    }
                  />
                  <div className={styles.block_actions}>
                    <Button onPress={() => handleMoveBlock(index, "up")}>
                      Up
                    </Button>
                    <Button onPress={() => handleMoveBlock(index, "down")}>
                      Down
                    </Button>
                    <Button
                      color="danger"
                      onPress={() => handleDeleteBlock(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            }

            if (block.type === "image") {
              return (
                <div key={index} className={styles.block_type_image}>
                  {block.src ? (
                    <Image
                      className={styles.block_type_image__image}
                      // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                      // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                      alt={block.description[locale]}
                      src={block.src}
                      // placeholder="blur" // размытие заднего фона при загрузке картинки
                      // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
                      quality={100} //качество картнки в %
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
                    <Image
                      className={styles.block_type_image__image}
                      // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                      // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                      alt={block.description[locale]}
                      src="https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/default_img.jpg"
                      // placeholder="blur" // размытие заднего фона при загрузке картинки
                      // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
                      quality={100} //качество картнки в %
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
                  )}
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
                      onPress={() =>
                        UploadPhoto(
                          block.src,
                          `events/id${database.id}`,
                          `content.${index}.src`,
                          index
                        )
                      }
                      isDisabled={isUploading}
                    >
                      {isUploading ? "Загрузка..." : "Загрузить файл"}
                    </Button>
                  </div>
                  <Textarea
                    className={styles.block_type_image__textarea}
                    label="Опис картинки (BETA)"
                    value={block.description[locale]}
                    onChange={(e) =>
                      handleChange(e, `content.${index}.description.${locale}`)
                    }
                  />
                  <Input
                    className={styles.block_type_image__input}
                    label="Розташування зображення"
                    value={block.src}
                    onChange={(e) => handleChange(e, `content.${index}.src`)}
                  />
                  <div className={styles.block_actions}>
                    <Button onPress={() => handleMoveBlock(index, "up")}>
                      Up
                    </Button>
                    <Button onPress={() => handleMoveBlock(index, "down")}>
                      Down
                    </Button>
                    <Button
                      color="danger"
                      onPress={() => handleDeleteBlock(index, block.src)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            }

            if (block.type === "imageS") {
              return (
                <div
                  id="gallery"
                  key={index}
                  className={styles.block_type_imageS}
                >
                  {block.src.map((image, subIndex) => (
                    <a
                      className={styles.block_type_imageS__link}
                      key={subIndex}
                      href={image.href}
                      data-pswp-width={image.width}
                      data-pswp-height={image.height}
                      data-id={image.href}
                    >
                      <Image
                        id={image.href}
                        className={styles.block_type_imageS__image}
                        // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                        // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                        alt={`Image ${subIndex}`}
                        src={image.href}
                        // placeholder="blur" // размытие заднего фона при загрузке картинки
                        // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
                        quality={100} //качество картнки в %
                        priority={true} // если true - loading = 'lazy' отменяеться
                        // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
                        fill={false} //заставляет изображение заполнять родительский элемент
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                    </a>
                  ))}
                  <Textarea
                    className={styles.block_type_image__textarea}
                    label="Опис картинки (BETA)"
                    value={block.description[locale]}
                    onChange={(e) =>
                      handleChange(e, `content.${index}.description.${locale}`)
                    }
                  />
                  <Input
                    className={styles.block_type_image__input}
                    label="Розташування зображення"
                    value={block.src}
                    onChange={(e) => handleChange(e, `content.${index}.src`)}
                  />
                  <div className={styles.block_actions}>
                    <Button onPress={() => handleMoveBlock(index, "up")}>
                      Up
                    </Button>
                    <Button onPress={() => handleMoveBlock(index, "down")}>
                      Down
                    </Button>
                    <Button
                      color="danger"
                      onPress={() => handleDeleteBlock(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </section>
  );
}
