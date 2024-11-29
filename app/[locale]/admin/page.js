"use client";

import { Textarea } from "@nextui-org/react";
import styles from "./admin.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
  const [loading, setLoading] = useState(true); // Состояние загрузки страницы
  const [file, setFile] = useState();
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

    fetch("/api/github-get")
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки данных");
        return res.json();
      })
      .then((data) => {
        setFile(data); // Устанавливаем данные пользователя
        setLoading(false); // Убираем состояние загрузки
      })
      .catch(() => {
        console.log("error /api/github-get");
      });
  }, [router]);

  if (loading) {
    return <div className={styles.Loading}>Loading...</div>; // Отображаем индикатор загрузки
  }

  async function handleFileUpload(data) {
    const filePath = "data/home.json"; // Путь в репозитории
    const fileContent = data; // Контент файла
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

      const data = await response.json();
      console.log("Файл успешно обновлен:", data);
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error.message);
    }
  }

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
            localStorage.removeItem("token"); // Удаляем токен
            router.push("/login"); // Перенаправляем на страницу входа
          }}
        >
          Выйти
        </button>
      </div>

      <form
        className={styles.from}
        onSubmit={(e) => {
          e.preventDefault(); // Предотвращаем стандартное поведение формы
          const formData = new FormData(e.target); // Создаем объект FormData из формы
          const updatedName = formData.get("ukName"); // Получаем значение из поля "ukName"
          // console.log(typeof(updatedName))
          // const updatedData = typeof(updatedName)
          const updatedData = {
            ...file,
            home: {
              ...file.home,
              uk: { ...file.home.uk, name: updatedName }, // Обновляем только имя в локали UK
            },
          };
          handleFileUpload(JSON.stringify(updatedData)); // Передаем обновленные данные в функцию
        }}
      >
        <div className={styles.input_list}>
          <h2>Имя</h2>
          <div className={styles.input_item}>
            <label className={styles.name}>UK</label>
            <input
              className={styles.input_title}
              type="text"
              name="ukName" // Указываем имя для поля, чтобы FormData могла его считать
              defaultValue={file ? file.home.uk.name : ""} // Устанавливаем значение по умолчанию
            />
          </div>
        </div>
        <button type="submit" className={styles.submitButton}>
          Сохранить
        </button>
      </form>

      {/* <form className={styles.from}>
        <div className={styles.input_list}>
          <h2>Им`я</h2>
          <div className={styles.input_item}>
            <label className={styles.name}>UK</label>
            <input
              className={styles.input_title}
              type="text"
              defaultValue={file ? file.home.uk.name : "nul"}
              onChange={(e) => handleFileUpload(e.target.value)}
            />
          </div>
        </div>
      </form> */}
    </section>
  );
}