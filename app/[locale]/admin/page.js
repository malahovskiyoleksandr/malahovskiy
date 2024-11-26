"use client";

import { Textarea } from "@nextui-org/react";
import styles from "./admin.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
  const [loading, setLoading] = useState(true); // Состояние загрузки страницы
  const [data, setData] = useState({
    uk: { name: "Олександр Малаховський", description: "..." },
    en: { name: "Oleksandr Malakhovsky", description: "..." },
    de: { name: "Oleksandr Malakhovskyi", description: "..." },
  });
  const [file, setFile] = useState(null);

  // const [currentLang, setCurrentLang] = useState("uk");
  const [message, setMessage] = useState("");

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
        // Загружаем текущие данные для редактирования
      })
      .catch(() => {
        localStorage.removeItem("token"); // Удаляем недействительный токен
        router.push("/login"); // Перенаправляем на страницу входа
      });
    
    
      fetch('/api/github-get')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [router]);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/github-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error saving data');
      }

      alert('Данные успешно сохранены!');
    } catch (error) {
      alert(`Ошибка сохранения данных: ${error.message}`);
    }
  };  

  const handleSubmit = (event) => {
    event.preventDefault();

    // Отправка данных на сервер для обновления
    fetch("/api/update-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), // Данные для обновления
    })
      .then((response) => {
        if (!response.ok) throw new Error("Ошибка при обновлении данных.");
        return response.json();
      })
      .then((result) => {
        console.log(result.message); // Сообщение об успехе
        setMessage("Данные успешно обновлены!");
      })
      .catch((error) => {
        console.error(error);
        setMessage("Ошибка при сохранении данных.");
      });
  };

  if (loading) {
    return <div className={styles.Loading}>Loading...</div>; // Отображаем индикатор загрузки
  }

  // if (error) return <p>Ошибка: {error}</p>;

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

        {/* {message && <p className={styles.message}>{message}</p>} */}

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

      <div>
      <h1>Админка</h1>
      <textarea
        value={JSON.stringify(data, null, 2)}
        onChange={e => setData(JSON.parse(e.target.value))}
        rows={20}
        cols={80}
      />
      <button onClick={handleSave}>Сохранить изменения</button>
    </div>

      {/* <form onSubmit={handleSubmit} className={styles.from}>
        <div className={styles.input_list}>
          <h2>Им`я</h2>
          <div className={styles.input_item}>
            <label className={styles.name}>UK</label>
            <input
              className={styles.input_title}
              type="text"
              value={data.uk.name} // Динамически отображаем имя на основе выбранного языка
              onChange={(e) =>
                setData({
                  ...data,
                  uk: {
                    ...data.uk,
                    name: e.target.value, // Обновляем только имя для текущего языка
                  },
                })
              }
            />
          </div>
          <div className={styles.input_item}>
            <label className={styles.name}>EN</label>
            <input
              className={styles.input_title}
              type="text"
              value={data.en.name} // Динамически отображаем имя на основе выбранного языка
              onChange={(e) =>
                setData({
                  ...data,
                  en: {
                    ...data.en,
                    name: e.target.value, // Обновляем только имя для текущего языка
                  },
                })
              }
            />
          </div>
          <div className={styles.input_item}>
            <label className={styles.name}>DE</label>
            <input
              className={styles.input_title}
              type="text"
              value={data.de.name} // Динамически отображаем имя на основе выбранного языка
              onChange={(e) =>
                setData({
                  ...data,
                  de: {
                    ...data.de,
                    name: e.target.value, // Обновляем только имя для текущего языка
                  },
                })
              }
            />
          </div>
        </div>
        <div className={styles.textarea_list}>
          <h2>Опис</h2>
          <div className={styles.textarea_item}>
            <Textarea
              label="UK"
              className={styles.input_description}
              value={data.uk.description} // Отображаем описание для текущего языка
              onChange={(e) =>
                setData({
                  ...data,
                  uk: {
                    ...data.uk,
                    description: e.target.value, // Обновляем только имя для текущего языка
                  },
                })
              }
            />
          </div>
          <div className={styles.textarea_item}>
            <Textarea
              label="EN"
              className={styles.input_description}
              value={data.en.description} // Отображаем описание для текущего языка
              onChange={(e) =>
                setData({
                  ...data,
                  en: {
                    ...data.en,
                    description: e.target.value, // Обновляем только имя для текущего языка
                  },
                })
              }
            />
          </div>
          <div className={styles.textarea_item}>
            <Textarea
              label="DE"
              className={styles.input_description}
              value={data.de.description} // Отображаем описание для текущего языка
              onChange={(e) =>
                setData({
                  ...data,
                  en: {
                    ...data.de,
                    description: e.target.value, // Обновляем только имя для текущего языка
                  },
                })
              }
            />
          </div>
        </div>
        <button className={styles.button_submit} type="submit">
          Зберегти
        </button>
      </form> */}
      {message && <p className={styles.submit_message}>{message}</p>}
    </section>
  );
}
