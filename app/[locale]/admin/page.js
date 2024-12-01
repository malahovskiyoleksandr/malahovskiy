"use client";

import styles from "./admin.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
  const [loading, setLoading] = useState(true); // Состояние загрузки страницы
  const [file, setFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Получаем токен из localStorage
    if (!token) {
      router.push("/login"); // Если токена нет, перенаправляем на страницу входа
      return;
    }

    // Проверяем токен через API
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
        localStorage.removeItem("token"); // Удаляем недействительный токен
        router.push("/login"); // Перенаправляем на страницу входа
      });

    console.log("1");
  }, [router]);

  useEffect(() => {
    Get();
    console.log("2");
  }, []);

  async function Get() {
    try {
      const res = await fetch("/api/github-get");
      if (!res.ok) throw new Error("Ошибка загрузки данных");
      const data = await res.json();
      setFile(data); // Устанавливаем данные
      setLoading(false); // Убираем состояние загрузки
      console.log("4");
    } catch (error) {
      console.log("error /api/github-get", error);
    }
  }

  async function handleFileUpload(data) {
    const filePath = "data/home.json"; // Путь в репозитории
    const fileContent = JSON.stringify(data); // Контент файла
    const commitMessage = "Обновление файла через API"; // Сообщение коммита

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

  if (loading || !file) {
    return <div className={styles.Loading}>Loading...</div>;
  }

  console.log("3");

  return (
    <section className={styles.container}>
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
            {console.log("10", file)}
            <input
              className={styles.input_title}
              type="text"
              name="ukName"
              value={file?.home?.uk?.name || ""} // Используем правильные данные для value
              onChange={(e) => {
                // Обновляем локальное состояние при вводе текста
                setFile({
                  ...file,
                  home: {
                    ...file.home,
                    uk: { ...file.home.uk, name: e.target.value },
                  },
                });
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
