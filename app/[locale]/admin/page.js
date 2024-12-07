"use client";

import styles from "./admin.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
  const [loading, setLoading] = useState(true); // Состояние загрузки страницы
  const [database, setDatabase] = useState(); // Состояние для данных из GitHub

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

  const handleChange = (e, lang) => {
    const { name, value } = e.target;

    setDatabase((prevFile) => ({
      ...prevFile,
      home: {
        ...prevFile.home,
        [lang]: {
          ...prevFile.home[lang],
          [name]: value,
        },
      },
    }));
  };

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
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options">
          <Tab key="photos" title="Головна">
            <Card>
              <CardBody>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.inputList}>
                    <h2>Имя</h2>
                    {["uk", "en", "de"].map((lang) => (
                      <div className={styles.inputItem} key={lang}>
                        <label className={styles.label}>
                          {lang.toUpperCase()}
                        </label>
                        <Input
                          type="text"
                          label="Name"
                          name="name"
                          value={database?.home?.[lang]?.name || ""}
                          onChange={(e) => handleChange(e, lang)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className={styles.textareaList}>
                    <h2>Описание</h2>
                    {["uk", "en", "de"].map((lang) => (
                      <div className={styles.textareaItem} key={lang}>
                        <label className={styles.label}>
                          {lang.toUpperCase()}
                        </label>
                        <Textarea
                          label="Description"
                          name="description"
                          placeholder="Enter your description"
                          className="max-w-xs"
                          value={database?.home?.[lang]?.description || ""}
                          onChange={(e) => handleChange(e, lang)}
                        />
                      </div>
                    ))}
                  </div>
                  <Button color="warning" type="submit">
                    Зберегти
                  </Button>
                </form>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="music" title="Галерея">
            <Card>
              <CardBody>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.inputList_Industrial}>
                    <h2>Industrial</h2>
                    {["uk", "en", "de"].map((lang) => (
                      <div className={styles.inputItem} key={lang}>
                        <label className={styles.label}>
                          {lang.toUpperCase()}
                        </label>
                        <Input
                          type="text"
                          label="Name"
                          name="name"
                          value={
                            database?.gallery?.industrial?.[lang]?.name || ""
                          }
                          onChange={(e) => handleChange(e, lang)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className={styles.inputList_Portraits}>
                    <h2>Portraits</h2>
                    {["uk", "en", "de"].map((lang) => (
                      <div className={styles.inputItem} key={lang}>
                        <label className={styles.label}>
                          {lang.toUpperCase()}
                        </label>
                        <Input
                          type="text"
                          label="Name"
                          name="name"
                          value={
                            database?.gallery?.portraits?.[lang]?.name || ""
                          }
                          onChange={(e) => handleChange(e, lang)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className={styles.inputList_DarkSide}>
                    <h2>Dark_side</h2>
                    {["uk", "en", "de"].map((lang) => (
                      <div className={styles.inputItem} key={lang}>
                        <label className={styles.label}>
                          {lang.toUpperCase()}
                        </label>
                        <Input
                          type="text"
                          label="Name"
                          name="name"
                          value={
                            database?.gallery?.dark_side?.[lang]?.name || ""
                          }
                          onChange={(e) => handleChange(e, lang)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className={styles.textareaList_Industrial}>
                    <h2>Industrial</h2>
                    {["uk", "en", "de"].map((lang) => (
                      <div className={styles.textareaItem} key={lang}>
                        <label className={styles.label}>
                          {lang.toUpperCase()}
                        </label>
                        <Textarea
                          label="Description"
                          name="description"
                          placeholder="Enter your description"
                          className="max-w-xs"
                          value={
                            database?.gallery?.industrial?.[lang]
                              ?.description || ""
                          }
                          onChange={(e) => handleChange(e, lang)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className={styles.textareaList_Portraits}>
                    <h2>Portraits</h2>
                    {["uk", "en", "de"].map((lang) => (
                      <div className={styles.textareaItem} key={lang}>
                        <label className={styles.label}>
                          {lang.toUpperCase()}
                        </label>
                        <Textarea
                          label="Description"
                          name="description"
                          placeholder="Enter your description"
                          className="max-w-xs"
                          value={
                            database?.gallery?.portraits?.[lang]?.description ||
                            ""
                          }
                          onChange={(e) => handleChange(e, lang)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className={styles.textareaList_DarkSide}>
                    <h2>DarkSide</h2>
                    {["uk", "en", "de"].map((lang) => (
                      <div className={styles.textareaItem} key={lang}>
                        <label className={styles.label}>
                          {lang.toUpperCase()}
                        </label>
                        <Textarea
                          label="Description"
                          name="description"
                          placeholder="Enter your description"
                          className="max-w-xs"
                          value={
                            database?.gallery?.dark_side?.[lang]?.description ||
                            ""
                          }
                          onChange={(e) => handleChange(e, lang)}
                        />
                      </div>
                    ))}
                  </div>
                  <Button color="warning" type="submit">
                    Зберегти
                  </Button>
                </form>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="videos" title="Заходи">
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
