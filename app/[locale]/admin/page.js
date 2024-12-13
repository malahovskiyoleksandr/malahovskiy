"use client";

import styles from "./admin.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Image from "next/image";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
  const [loading, setLoading] = useState(true); // Состояние загрузки страницы
  const [database, setDatabase] = useState(); // Состояние для данных из GitHub
  const [photo, setPhoto] = useState(); // Состояние для данных из GitHub

  // Логика для получения информации о пользователе и проверки токена
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
        setUser(data.user); // Устанавливаем данные пользователя
        setLoading(false); // Убираем состояние загрузки
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  // Загружаем данные с API
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/github-get");
        if (!response.ok) {
          throw new Error("Ошибка при обращении к API GET");
        }
        const data = await response.json();
        setDatabase(data);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка: fetch(github-get)", error);
      }
    };

    loadData();
  }, []);

  const handleChange_Home = (e, lang) => {
    const { name, value } = e.target;

    setDatabase((prevFile) => ({
      ...prevFile,
      home: {
        ...prevFile.home,
        [name]: {
          ...prevFile.home[name],
          [lang]: value,
        },
      },
    }));
  };

  const handleChange_Gallery = (e, lang) => {
    console.log(e.target)
    const { name, value, index } = e.target;

    setDatabase((prevFile) => ({
      ...prevFile,
      gallery: {
        ...prevFile.gallery,
        industrial: {
          ...prevFile.gallery.industrial,
          [name]: {
            ...prevFile.gallery.industrial[name],
            [lang]: value,
          },
          // page: {
          //   ...prevFile.gallery.industrial.page
          //   [index]
          // }
        },
        // portraits: {
        //   ...prevFile.gallery.portraits,
        //   [name]: {
        //     ...prevFile.gallery.portraits[name],
        //     [lang]: value,
        //   },
        // },
        // dark_side: {
        //   ...prevFile.gallery.dark_side,
        //   [name]: {
        //     ...prevFile.gallery.dark_side[name],
        //     [lang]: value,
        //   },
        // },
      },
    }));
  };

  // const handleFileChange = (event) => {
  //   const uploadedFile = event.target.files[0];
  //   console.log(uploadedFile);
  //   if (uploadedFile) {
  //     setPhoto(uploadedFile);
  //   }
  // };
  async function handleFileUpload(data) {
    const filePath = "data/database.json";
    const fileContent = JSON.stringify(data);
    const commitMessage = "Обновление файла через API";

    try {
      const response = await fetch("/api/github-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath, fileContent, commitMessage }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при загрузке файла.");
      }

      const responseData = await response.json();
      console.log("Файл успешно обновлен:", responseData);
      setDatabase(data); // Обновляем состояние с новыми данными
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = { ...database }; // Делаем копию данных
    handleFileUpload(updatedData); // Отправляем обновленные данные
  };

  if (loading) {
    return <div className={styles.Loading}>Loading...</div>;
  }

  return (
    <div className={styles.adminPanel}>
      <header className={styles.header}>
        {user && (
          <div className={styles.profile}>
            {/* <img
                src="/images/admin-avatar.jpg"
                alt="Admin"
                className={styles.avatar}
              /> */}
            <div>
              <h2>User: {user.email}</h2>
              <p>Role: {user.role}</p>
            </div>
          </div>
        )}

        <button
          className={styles.logout}
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          Выйти
        </button>
      </header>
      <div className={styles.main}>
        <Tabs aria-label="Options">
          {/* <Tab key="main" title="Головна">
            <Card>
              <CardBody>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.inputList}>
                    <h2>Имя</h2>
                    {["uk", "en", "de"].map((lang) => (
                      <Input
                        key={lang}
                        type="text"
                        label={`Name ${lang.toUpperCase()}`}
                        name="name"
                        value={database?.home?.name?.[lang] || ""}
                        onChange={(e) => handleChange_Home(e, lang)}
                      />
                    ))}
                  </div>

                  <div className={styles.textareaList}>
                    <h2>Описание</h2>
                    {["uk", "en", "de"].map((lang) => (
                      <Textarea
                        key={lang}
                        label={`Description ${lang.toUpperCase()}`}
                        name="description"
                        placeholder="Enter your description"
                        className="max-w-xs"
                        value={database?.home?.description?.[lang] || ""}
                        onChange={(e) => handleChange_Home(e, lang)}
                      />
                    ))}
                  </div>

                  <div className={styles.mainImage}>
                    <div className={styles.currentImage}>
                      <label className={styles.label}>Old</label>
                      <Image
                        className={styles.main_image}
                        // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                        // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                        alt="mainImage"
                        src={database?.home?.main_image?.src || ""}
                        // placeholder="blur" // размытие заднего фона при загрузке картинки
                        // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
                        quality={100}
                        priority={false} // если true - loading = 'lazy' отменяеться
                        loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
                        fill={false} //заставляет изображение заполнять родительский элемент
                        // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
                        sizes="100%"
                        width={100} // задать правильное соотношение сторон адаптивного изображения
                        height={100}
                        style={
                          {
                            // width: "100%",
                            // height: "200px",
                            // objectFit: "cover", // Изображение масштабируется, не обрезаясь
                            // objectFit: "contain", // Изображение масштабируется, не обрезаясь
                            // objectPosition: "top",
                          }
                        }
                      />
                    </div>
                    <div className={styles.newImage}>
                      <label className={styles.label}>New</label>
                      <Input
                        type="file"
                        label="Name"
                        name="name"
                        accept="image/*"
                        // value={database?.home?.name?.[lang] || ""}
                        onChange={(e) => handleFileChange(e)}
                      />
                    </div>
                  </div>
                  <Button color="warning" type="submit">
                    Зберегти
                  </Button>
                </form>
              </CardBody>
            </Card>
          </Tab> */}
          <Tab key="gallery" title="Галерея">
            <Card>
              <CardBody>
                <Tabs aria-label="Options">
                  <Tab key="Industrial" title="Industrial">
                    <Card>
                      <CardBody>
                        <form className={styles.form} onSubmit={handleSubmit}>
                          <div className={styles.industrial_box}>
                            <h2>Industrial</h2>
                            <div className={styles.inputList_Industrial}>
                              {["uk", "en", "de"].map((lang) => (
                                <div className={styles.inputItem} key={lang}>
                                  <Input
                                    type="text"
                                    label={`Name ${lang.toUpperCase()}`}
                                    name="name"
                                    value={
                                      database?.gallery?.industrial?.name?.[
                                        lang
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleChange_Gallery(e, lang)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                            <div className={styles.textareaList_Industrial}>
                              {["uk", "en", "de"].map((lang) => (
                                <div className={styles.textareaItem} key={lang}>
                                  <Textarea
                                    label={`Description ${lang.toUpperCase()}`}
                                    name="description"
                                    placeholder="Enter your description"
                                    className="max-w-xs"
                                    value={
                                      database?.gallery?.industrial
                                        ?.description?.[lang] || ""
                                    }
                                    onChange={(e) =>
                                      handleChange_Gallery(e, lang)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className={styles.industrial_box__images}>
                            {database?.gallery?.industrial?.page.map(
                              (image, index) => (
                                <div
                                  key={index}
                                  className={styles.industrial_box__image_item}
                                >
                                  <Image
                                    id={image.id}
                                    className={styles.image}
                                    // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                                    // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                                    alt={image.name}
                                    src={image.src}
                                    // placeholder="blur" // размытие заднего фона при загрузке картинки
                                    // blurDataURL="/path-to-small-blurry-version.jpg" // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
                                    quality={10}
                                    priority={true} // если true - loading = 'lazy' отменяеться
                                    // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
                                    fill={false} //заставляет изображение заполнять родительский элемент
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
                                    // sizes="100vh"
                                    width={100} // задать правильное соотношение сторон адаптивного изображения
                                    height={100}
                                  />
                                  <div
                                    className={
                                      styles.industrial_box__image_item_nameDescription
                                    }
                                  >
                                    {["uk", "en", "de"].map((lang) => (
                                      <div
                                        className={styles.inputItem}
                                        key={lang}
                                      >
                                        <Input
                                          type="text"
                                          label={`Name ${lang.toUpperCase()}`}
                                          name="name"
                                          value={image.name?.[lang] || "name"}
                                          onChange={(e) =>
                                            handleChange_Gallery(e, lang, index )
                                          }
                                        />

                                      </div>
                                    ))}
                                    {["uk", "en", "de"].map((lang) => (
                                      <div
                                        className={styles.inputItem}
                                        key={lang}
                                      >

                                        <Textarea
                                          label={`Description ${lang.toUpperCase()}`}
                                          name="description"
                                          placeholder="Enter your description"
                                          className="max-w-xs"
                                          value={
                                            image.description?.[lang] || "name"
                                          }
                                          onChange={(e) =>
                                            handleChange_Gallery(e, lang)
                                          }
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                          <Button color="warning" type="submit">
                            Зберегти
                          </Button>
                        </form>
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab key="Portraits" title="Portraits">
                    <Card>
                      <CardBody>
                        <form className={styles.form} onSubmit={handleSubmit}>
                          <div className={styles.portraits_box}>
                            <h2>Portraits</h2>
                            <div className={styles.inputList_Portraits}>
                              {["uk", "en", "de"].map((lang) => (
                                <div className={styles.inputItem} key={lang}>
                                  <Input
                                    type="text"
                                    label={`Name ${lang.toUpperCase()}`}
                                    name="name"
                                    value={
                                      database?.gallery?.portraits?.name?.[
                                        lang
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleChange_Gallery(e, lang)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                            <div className={styles.textareaList_Portraits}>
                              {["uk", "en", "de"].map((lang) => (
                                <div className={styles.textareaItem} key={lang}>
                                  <Textarea
                                    label={`Description ${lang.toUpperCase()}`}
                                    name="description"
                                    placeholder="Enter your description"
                                    className="max-w-xs"
                                    value={
                                      database?.gallery?.portraits
                                        ?.description?.[lang] || ""
                                    }
                                    onChange={(e) =>
                                      handleChange_Gallery(e, lang)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button color="warning" type="submit">
                            Зберегти
                          </Button>
                        </form>
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab key="Dark_side" title="Dark_side">
                    <Card>
                      <CardBody>
                        <form className={styles.form} onSubmit={handleSubmit}>
                          <div className={styles.darkSide_box}>
                            <h2>DarkSide</h2>
                            <div className={styles.inputList_DarkSide}>
                              {["uk", "en", "de"].map((lang) => (
                                <div className={styles.inputItem} key={lang}>
                                  <Input
                                    type="text"
                                    label={`Name ${lang.toUpperCase()}`}
                                    name="name"
                                    value={
                                      database?.gallery?.dark_side?.name?.[
                                        lang
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleChange_Gallery(e, lang)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                            <div className={styles.textareaList_DarkSide}>
                              {["uk", "en", "de"].map((lang) => (
                                <div className={styles.textareaItem} key={lang}>
                                  <Textarea
                                    label={`Description ${lang.toUpperCase()}`}
                                    name="description"
                                    placeholder="Enter your description"
                                    className="max-w-xs"
                                    value={
                                      database?.gallery?.dark_side
                                        ?.description?.[lang] || ""
                                    }
                                    onChange={(e) =>
                                      handleChange_Gallery(e, lang)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button color="warning" type="submit">
                            Зберегти
                          </Button>
                        </form>
                      </CardBody>
                    </Card>
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="events" title="Заходи">
            <Card>
              <CardBody>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
