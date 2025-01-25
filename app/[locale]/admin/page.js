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
  Alert,
} from "@nextui-org/react";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

export default function AdminPage({ params, onUpload }) {
  const locale = params.locale;
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [database, setDatabase] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/github-get");
        if (!response.ok) {
          throw new Error("Помилка завантаження даних");
        }
        const data = await response.json();
        setDatabase(data);
      } catch (error) {
        console.error("Ошибка:", error.message);
      }
    };

    loadData();
  }, []);
  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
  };
  const handleSomeAction = async (message) => {
    try {
      showAlert(message);
    } catch (error) {
      console.error("Ошибка:", error.message);
      showAlert("Ошибка при выполнении действия.");
    }
  };
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
  const updateDB = async () => {
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

      console.log("Изменения успешно сохранены:");
    } catch (error) {
      console.error("Ошибка сохранения:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const addImage__gallery = async (path, newItem, item) => {
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

          // // Логируем действие
          // if (!updated.logs) {
          //   updated.logs = []; // Создаем массив логов, если его нет
          // }

          // // Добавляем новый лог в начало массива
          // updated.logs.unshift({
          //   timestamp: new Date().toISOString(),
          //   action: "Добавление",
          //   target: path,
          //   details: `Доданий новий елемент: ${JSON.stringify(newItem)}`,
          // });

          return updated;
        });
        await updateDB();
      } catch (error) {
        console.error("Помилка при додаваннi:", error);
        alert("Помилка видалення!");
      } finally {
        handleSomeAction("Фото успішно додано!");
        // setIsUploading(false); // Снимаем состояние ожидания
      }
    }
  };
  const addEvent__events = async (path, newItem, item) => {
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

          // // Логируем действие
          // if (!updated.logs) {
          //   updated.logs = []; // Создаем массив логов, если его нет
          // }

          // // Добавляем новый лог в начало массива
          // updated.logs.unshift({
          //   timestamp: new Date().toISOString(),
          //   action: "Добавление",
          //   target: path,
          //   details: `Доданий новий елемент: ${JSON.stringify(newItem)}`,
          // });
          return updated;
        });
        await updateDB();
      } catch (error) {
        console.error("Помилка при додаваннi:", error);
        alert("Помилка видалення!");
      } finally {
        handleSomeAction("Захід успішно додано!");
        // setIsUploading(false); // Снимаем состояние ожидания
      }
    }
  };
  const deleteEvent__events = async (directoryPath, path, index) => {
    const confirmDelete = confirm("Видалити захiд?");
    if (confirmDelete) {
      try {
        if (directoryPath) {
          // Проверяем, существует ли директория
          const checkResponse = await fetch("/api/github-delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filePath: directoryPath,
              isDirectory: true,
            }),
          });
          if (checkResponse.status === 404) {
            console.warn(
              "Директория не найдена, пропускаем удаление директории."
            );
          } else if (!checkResponse.ok) {
            throw new Error("Ошибка удаления директории");
          }
        }

        // Удаление из базы данных и обновление
        setDatabase((prev) => {
          const updated = { ...prev };
          const keys = path.split(".");
          let target = updated;

          keys.slice(0, -1).forEach((key) => {
            if (!target[key]) target[key] = [];
            target = target[key];
          });

          target[keys[keys.length - 1]].splice(index, 1);
          return updated;
        });

        await updateDB();
        handleSomeAction("Захід успішно видалено!");
      } catch (error) {
        console.error("Ошибка удаления директории:", error.message);
        alert("Ошибка удаления директории или обновления базы данных");
      }
    }
  };
  const deleteImageBlock__gallery = async (imagePath, path, index) => {
    const confirmDelete = confirm("Видалити фото?");
    if (confirmDelete) {
      if (!imagePath == "") {
        await deleteImgFromGitgub(imagePath);
      }
      await deleteImgFromDB(path, index);
      await updateDB();
    }
  };
  // const handleUploadAndUpdateDB = async (pathImg, pathDB) => {

  //   if (!selectedFile) {
  //     alert("Выберите файл!");
  //     return;
  //   }

  //   setIsUploading(true);
  //   try {
  //     // Загрузка изображения на GitHub
  //     const uploadResult = await addImgInGitHub(pathImg, selectedFile);

  //     // Формирование нового пути к изображению
  //     const newImagePath = `https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/${pathImg}/${selectedFile.name}`;

  //     // Обновление базы данных
  //     setDatabase((prev) => {
  //       const updated = { ...prev };
  //       const keys = pathDB.split(".");
  //       let target = updated;

  //       // Доступ к целевому объекту
  //       keys.slice(0, -1).forEach((key) => {
  //         if (!target[key]) target[key] = {};
  //         target = target[key];
  //       });

  //       target[keys[keys.length - 1]] = newImagePath; // Устанавливаем новый путь
  //       return updated;
  //     });
  //   } catch (error) {
  //     console.error("Ошибка загрузки или обновления базы:", error.message);
  //     alert("Ошибка загрузки файла или обновления базы данных");
  //   } finally {
  //     handleSomeAction("Фото успішно завантажено!");
  //     setIsUploading(false);
  //   }
  // };
  const updateImagePathInDatabase = async (pathDB, imagePath) => {
    try {
      const newImagePath = `https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/${imagePath}/${selectedFile.name}`;
      setDatabase((prev) => {
        const updated = { ...prev };
        const keys = pathDB.split(".");
        let target = updated;

        // Доступ к целевому объекту
        keys.slice(0, -1).forEach((key) => {
          if (!target[key]) target[key] = {};
          target = target[key];
        });

        // Обновляем путь в базе данных
        target[keys[keys.length - 1]] = newImagePath;
        console.log("Путь успешно добавлен в базу данных!");
        return updated;
      });
    } catch (error) {
      console.error("Ошибка обновления базы данных:", error.message);
      throw error; // Пробрасываем ошибку для обработки в вызывающем коде
    }
  };

  const uploadImageToGitHub = async (pathImg, selectedFile) => {
    try {
      // Формирование пути к изображению
      const filePath = `public/images/${pathImg}/${selectedFile.name}`;
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(selectedFile);
      });

      const commitMessage = `Добавлено изображение: ${selectedFile.name}`;

      // Отправляем запрос на API загрузки
      const response = await fetch("/api/github-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath, fileContent, commitMessage }),
      });

      if (response.ok) {
        console.log("Файл успешно загружен на GitHub:", selectedFile.name);
      } else {
        throw new Error("Ошибка загрузки изображения на GitHub");
      }

      return filePath; // Возвращаем путь для последующего использования
    } catch (error) {
      console.error("Ошибка загрузки файла на GitHub:", error.message);
      throw error; // Пробрасываем ошибку, чтобы обработать ее в вызывающем коде
    }
  };

  const UploadPhoto = async (pathOldImgInGithub, PathDB, addPathImg, index) => {
    if (!selectedFile) {
      alert("Файл не вибрано");
      return;
    }
    if (!pathOldImgInGithub == "") {
      const fileExists = await checkIfFileExists(addPathImg, selectedFile.name);
      if (fileExists) {
        alert("Файл с таким именем уже существует!");
        return;
      }
      await deleteImgFromDB(PathDB, index);
      await deleteImgFromGitgub(pathOldImgInGithub);
    }
    await uploadImageToGitHub(addPathImg, selectedFile);
    await updateImagePathInDatabase(PathDB, addPathImg);
    // await handleUploadAndUpdateDB(addPathImg, PathDB);
    await updateDB();
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
  const deleteImgFromDB = async (pathDB, index) => {
    setDatabase((prev) => {
      const updated = { ...prev };
      const keys = pathDB.split(".");
      let target = updated;

      keys.slice(0, -1).forEach((key) => {
        if (!target[key]) target[key] = {};
        target = target[key];
      });

      const lastKey = keys[keys.length - 1];

      if (index !== undefined && Array.isArray(target[lastKey])) {
        // Удаление элемента из массива
        target[lastKey].splice(index, 1);
      } else {
        // Удаление одиночного элемента
        target[lastKey] = "";
      }

      return updated;
    });
  };
  const deleteImgFromGitgub = async (pathOldImgInGithub) => {
    const filePath = pathOldImgInGithub.replace(
      "https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/",
      ""
    );
    console.log(pathOldImgInGithub);
    console.log(filePath);
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

  if (!database) {
    return (
      <div className="flex items-center justify-center h-[95vh]">
        <Spinner color="warning" label="Loading" labelColor="warning" />
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
          onPress={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          Вийти
        </Button>
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

      <div className={styles.main}>
        <Tabs aria-label="Админ Панель">
          <Tab key="home" title="ГОЛОВНА" className={styles.home_page}>
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
                  onPress={updateDB}
                  isDisabled={isSubmitting}
                >
                  {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                </Button>
                <div className={styles.home_images}>
                  <div className={styles.mainPhoto_home}>
                    <div className={styles.image_box}>
                      {database.home.main_image.src ? ( // Проверяем, есть ли ссылка на изображение
                        <Image
                          className={styles.image}
                          // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                          // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                          alt="Main Image"
                          src={database.home.main_image.src}
                          quality={100} //качество картнки в %
                          priority={true} // если true - loading = 'lazy' отменяеться
                          fill={true} //заставляет изображение заполнять родительский элемент
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          // width={300} // задать правильное соотношение сторон адаптивного изображения
                          // height={200}
                        />
                      ) : (
                        <Image
                          className={styles.image}
                          // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                          // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                          alt="Main Image"
                          src="https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/default_img.jpg"
                          quality={30} //качество картнки в %
                          priority={true} // если true - loading = 'lazy' отменяеться
                          fill={false} //заставляет изображение заполнять родительский элемент
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          width={300} // задать правильное соотношение сторон адаптивного изображения
                          height={200}
                        />
                      )}
                    </div>
                    <div className={styles.submit_img}>
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
                            database.home.main_image.src,
                            `home.main_image.src`,
                            "home_page"
                          )
                        }
                        isDisabled={isUploading}
                      >
                        {isUploading ? "Загрузка..." : "Загрузить файл"}
                      </Button>
                    </div>
                  </div>
                  <div className={styles.backround_home}>
                    <div className={styles.image_box}>
                      {database.home.background_image.src ? (
                        <Image
                          className={styles.image}
                          alt="background_image"
                          src={database.home.background_image.src}
                          quality={30} //качество картнки в %
                          priority={true} // если true - loading = 'lazy' отменяеться
                          fill={true} //заставляет изображение заполнять родительский элемент
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          // width={300} // задать правильное соотношение сторон адаптивного изображения
                          // height={200}
                        />
                      ) : (
                        <Image
                          className={styles.image}
                          // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                          // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                          alt="Main Image"
                          src="https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/default_img.jpg"
                          quality={30} //качество картнки в %
                          priority={true} // если true - loading = 'lazy' отменяеться
                          fill={false} //заставляет изображение заполнять родительский элемент
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          width={300} // задать правильное соотношение сторон адаптивного изображения
                          height={200}
                        />
                      )}
                    </div>
                    <div className={styles.submit_img}>
                      <Input
                        className={styles.input_downloadFile}
                        type="file"
                        onChange={handleFileChange}
                      />
                      <Button
                        className={styles.button_downloadFile}
                        color="success"
                        onPress={() =>
                          UploadPhoto(
                            database.home.background_image.src,
                            `home.background_image.src`,
                            "home_page"
                          )
                        }
                        isDisabled={isUploading}
                      >
                        {isUploading ? "Загрузка..." : "Загрузить файл"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>

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
                                onPress={updateDB}
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
                                      quality={10} //качество картнки в %
                                      priority={true} // если true - loading = 'lazy' отменяеться
                                      fill={false} //заставляет изображение заполнять родительский элемент
                                      sizes="100%"
                                      width={300} // задать правильное соотношение сторон адаптивного изображения
                                      height={200}
                                    />
                                  ) : (
                                    <Image
                                      className={styles.image}
                                      // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                                      // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                                      alt={value.name.en}
                                      src="https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/default_img.jpg"
                                      quality={100} //качество картнки в %
                                      priority={true} // если true - loading = 'lazy' отменяеться
                                      fill={true} //заставляет изображение заполнять родительский элемент
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                  )}
                                </div>
                                <div className={styles.downloadImage_block}>
                                  <Input
                                    className={styles.input_downloadFile}
                                    type="file"
                                    onChange={handleFileChange}
                                  />
                                  <Button
                                    className={styles.button_downloadFile}
                                    color="success"
                                    onPress={() =>
                                      UploadPhoto(
                                        value.src,
                                        `gallery.${key}.src`,
                                        `gallery`
                                      )
                                    }
                                    isDisabled={isUploading}
                                  >
                                    {isUploading
                                      ? "Загрузка..."
                                      : "Загрузить файл"}
                                  </Button>
                                </div>
                              </div>

                              {/* Редактирование изображений */}
                              <div className={styles.tab_images_box}>
                                <Button
                                  className={styles.imageSection}
                                  onPress={() =>
                                    addImage__gallery(
                                      `gallery.${key}.page`,
                                      {
                                        id: null,
                                        src: "",
                                        linkVideo: "",
                                        name: {
                                          uk: "Нове зображення",
                                          en: "",
                                          de: "",
                                        },
                                        description: {
                                          uk: "",
                                          en: "",
                                          de: "",
                                        },
                                        material: {
                                          uk: "",
                                          en: "",
                                          de: "",
                                        },
                                        size: "",
                                        date: "",
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
                                          quality={10} //качество картнки в %
                                          priority={true} // если true - loading = 'lazy' отменяеться
                                          fill={true} //заставляет изображение заполнять родительский элемент
                                          sizes="100%"
                                        />
                                      ) : (
                                        <Image
                                          className={styles.image}
                                          // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                                          // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                                          alt={image.name[locale]}
                                          src="https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/default_img.jpg"
                                          quality={100} //качество картнки в %
                                          priority={true} // если true - loading = 'lazy' отменяеться
                                          fill={true} //заставляет изображение заполнять родительский элемент
                                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                      )}
                                    </div>
                                    <div className={styles.download_images}>
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
                                            image.src,
                                            `gallery.${key}.page.${index}.src`,
                                            `gallery/${key}`,
                                            index
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
                                      {["uk", "en", "de"].map((lang) => (
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
                                                  label={`Назва (${lang.toUpperCase()})`}
                                                  value={image.name[lang]}
                                                  onChange={(e) =>
                                                    handleChange(
                                                      e,
                                                      `gallery.${key}.page.${index}.name.${lang}`
                                                    )
                                                  }
                                                />
                                                <Textarea
                                                  className="max-w-xs"
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
                                                <Input
                                                  classNames={{
                                                    base: "max-w-xs",
                                                    input:
                                                      "resize-y min-h-[10px]",
                                                  }}
                                                  label={`Матерiал (${lang.toUpperCase()})`}
                                                  value={image.material[lang]}
                                                  onChange={(e) =>
                                                    handleChange(
                                                      e,
                                                      `gallery.${key}.page.${index}.material.${lang}`
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
                                                <Input
                                                  classNames={{
                                                    base: "max-w-xs",
                                                    input:
                                                      "resize-y min-h-[10px]",
                                                  }}
                                                  label={`Роздільна здатність картинки (Ширина)`}
                                                  value={image.width}
                                                  onChange={(e) =>
                                                    handleChange(
                                                      e,
                                                      `gallery.${key}.page.${index}.width`
                                                    )
                                                  }
                                                />
                                                <Input
                                                  classNames={{
                                                    base: "max-w-xs",
                                                    input:
                                                      "resize-y min-h-[10px]",
                                                  }}
                                                  label={`Роздільна здатність картинки (висота)`}
                                                  value={image.height}
                                                  onChange={(e) =>
                                                    handleChange(
                                                      e,
                                                      `gallery.${key}.page.${index}.height`
                                                    )
                                                  }
                                                />
                                                <Input
                                                  classNames={{
                                                    base: "max-w-xs",
                                                    input:
                                                      "resize-y min-h-[10px]",
                                                  }}
                                                  label={`Cилка на відео`}
                                                  value={image.linkVideo}
                                                  onChange={(e) =>
                                                    handleChange(
                                                      e,
                                                      `gallery.${key}.page.${index}.linkVideo`
                                                    )
                                                  }
                                                />
                                              </div>
                                            </CardBody>
                                          </Card>
                                        </Tab>
                                      ))}
                                    </Tabs>
                                    <h3>id:{image.id}</h3>
                                    <div className={styles.block_actions}>
                                      <div
                                        className={styles.block_actions_add_del}
                                      >
                                        <Button
                                          color="success"
                                          onPress={updateDB}
                                          isDisabled={isSubmitting}
                                        >
                                          {isSubmitting
                                            ? "Збереження..."
                                            : "Зберегти зміни"}
                                        </Button>
                                        <Button
                                          color="danger"
                                          onPress={() => {
                                            deleteImageBlock__gallery(
                                              image.src, // Путь к изображению
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
                                          onPress={() =>
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
                                          onPress={() =>
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

          <Tab key="events" title="ПОДІЇ" className={styles.events}>
            <Card>
              <CardBody>
                <section className={styles.events_container}>
                  <Button
                    color="success"
                    className={styles.buttonAdd}
                    onPress={() =>
                      addEvent__events(
                        `events`,
                        {
                          id: null,
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
                    Додати нову подiю
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
                              quality={100} //качество картнки в %
                              priority={true} // если true - loading = 'lazy' отменяеться
                              fill={true} //заставляет изображение заполнять родительский элемент
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <Image
                              className={styles.image}
                              // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                              // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                              alt={event.title[locale]}
                              src="https://raw.githubusercontent.com/malahovskiyoleksandr/DataBase/main/public/images/default_img.jpg"
                              quality={100} //качество картнки в %
                              priority={true} // если true - loading = 'lazy' отменяеться
                              fill={true} //заставляет изображение заполнять родительский элемент
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          )}
                        </div>
                        <h3 className={styles.title}>{event.title[locale]}</h3>
                      </Link>
                      <h3 className={styles.event_data}>id {event.id}</h3>
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
                          onPress={() => {
                            UploadPhoto(
                              event.main_image,
                              `events.${index}.main_image`,
                              `events/id${event.id}`,
                              index
                            );
                          }}
                          isDisabled={isSubmitting}
                        >
                          {isUploading
                            ? "Завантаження..."
                            : "Завантажити картинку"}
                        </Button>
                      </div>
                      {/* <Input
                        classNames={{
                          base: "max-w-xs",
                          input: "resize-y min-h-[10px]",
                        }}
                        label={`Дата`}
                        value={event.date}
                        onChange={(e) =>
                          handleChange(e, `events.${index}.date`)
                        }
                      /> */}
                      {/* <Button
                        color="success"
                        onPress={updateDB}
                        isDisabled={isSubmitting}
                      >
                        {isSubmitting ? "Збереження..." : "Зберегти зміни"}
                      </Button> */}
                      {/* {console.log(event.id)} */}
                      <Button
                        color="danger"
                        className={styles.delete_button}
                        onPress={() =>
                          deleteEvent__events(
                            `public/images/events/id${event.id}`, // Путь к директории на GitHub
                            `events`, // Путь в базе данных
                            index // Индекс элемента в массиве
                          )
                        }
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
