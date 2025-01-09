"use client";

import React from "react";
import styles from "./event.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { Textarea, Button, Spinner } from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody, Input, Alert } from "@nextui-org/react";

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

  const handleSubmit = async () => {
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

      if (!response.ok) {
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

  const handleDeleteBlock = (index) => {
    setDatabase((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
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

  const handleUploadAndUpdateDB = async (pathImg, pathDB, index) => {
    if (!selectedFile) {
      alert("Выберите файл!");
      return;
    }

    setIsUploading(true);
    try {
      // Загружаем изображение на GitHub
      const uploadResult = await uploadImageToGitHub(pathImg, selectedFile);

      // Генерируем новый путь для изображения
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
    } catch (error) {
      console.error("Ошибка загрузки или обновления базы:", error.message);
      alert("Ошибка загрузки файла или обновления базы данных");
    } finally {
      handleSomeAction("Успішне додавання фото!");
      setIsUploading(false);
    }
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-[95vh]">
  //       <Spinner color="warning" label="Loading" labelColor="warning" />
  //     </div>
  //   );
  // }

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
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Зберегти"}
        </Button>
        {/* <div className={styles.buttons}> */}
        <Button onClick={handleAddTextBlock} color="primary">
          Add Text Block
        </Button>
        <Button onClick={handleAddImageBlock} color="secondary">
          Add Image Block
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
                    <Button onClick={() => handleMoveBlock(index, "up")}>
                      Up
                    </Button>
                    <Button onClick={() => handleMoveBlock(index, "down")}>
                      Down
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => handleDeleteBlock(index)}
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
                      onClick={() =>
                        handleUploadAndUpdateDB(
                          `events/id${database.id}`,
                          `content.${index}.src`,
                          index
                        )
                      }
                      disabled={isUploading}
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
                    <Button onClick={() => handleMoveBlock(index, "up")}>
                      Up
                    </Button>
                    <Button onClick={() => handleMoveBlock(index, "down")}>
                      Down
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => handleDeleteBlock(index)}
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
                    <Button onClick={() => handleMoveBlock(index, "up")}>
                      Up
                    </Button>
                    <Button onClick={() => handleMoveBlock(index, "down")}>
                      Down
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => handleDeleteBlock(index)}
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
