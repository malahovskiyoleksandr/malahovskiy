"use client";

import styles from "./admin.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
  const [loading, setLoading] = useState(true); // Состояние загрузки страницы
  const [file, setFile] = useState(null);

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
    // Вызов Get() для получения данных
    async function fetchData() {
      const result = await Get();
      console.log(result)
      // setData1(result); // Сохраняем данные в data1
      setFile(result); // Устанавливаем данные в состояние file (если нужно)
      setLoading(false); // Загружено
    }

    fetchData(); // Вызов функции для получения данных
  }, []);

  const GITHUB_REPO = "malahovskiyoleksandr/malahovskiy";
  const GITHUB_FILE_PATH = "data/home.json";
  async function Get() {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
        {
          method: "GET",
          headers: {
            // "Cache-Control": "no-store",
            // Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при получении файла с GitHub");
      }

      const Data = await response.json();
      const Content = Buffer.from(Data.content, "base64").toString("utf-8");
      return JSON.parse(Content);
    } catch (error) {
      console.error("Ошибка:", error.message);
      // return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // Обработка загрузки данных на GitHub
  async function handleFileUpload(data) {
    const filePath = "data/home.json";
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
      setFile(data); // Обновляем состояние с новыми данными
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error.message);
    }
  }

  if (loading) {
    return <div className={styles.Loading}>Loading...</div>;
  }

  return (
    <section
      className={styles.container}
      key={file?.home?.uk?.name || "loading"}
    >
      {" "}
      {/* Принудительный ререндер */}
      <h1 className={styles.title}>Ласкаво просимо до Панелі Адміністратора</h1>
      <div className={styles.admin_header}>
        {user && (
          <div className={styles.userInfo}>
            <p>Email: {user.email}</p>
            <p>Роль: {user.role}</p>
          </div>
        )}
        <button
          className={styles.logoutButton}
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          Выйти
        </button>
      </div>
      <form
        className={styles.from}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const updatedName = formData.get("ukName");
          const updatedData = {
            ...file,
            home: {
              ...file.home,
              uk: { ...file.home.uk, name: updatedName },
            },
          };
          handleFileUpload(updatedData);
        }}
      >
        <div className={styles.input_list}>
          <h2>Имя</h2>
          <div className={styles.input_item}>
            <label className={styles.name}>UK</label>
            <input
              className={styles.input_title}
              type="text"
              name="ukName"
              value={file?.home?.uk?.name || ""} // Обновляем значение поля с актуальными данными
              onChange={(e) => {
                // Обновляем локальное состояние при вводе текста
                setFile((prevFile) => ({
                  ...prevFile,
                  home: {
                    ...prevFile.home,
                    uk: { ...prevFile.home.uk, name: e.target.value },
                  },
                }));
              }}
            />
          </div>
        </div>
        <button type="submit" className={styles.submitButton}>
          Сохранить
        </button>
      </form>
    </section>
  );
}
