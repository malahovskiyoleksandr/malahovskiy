"use client";

import styles from "./admin.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
  const [loading, setLoading] = useState(true); // Состояние загрузки страницы
  const [data, setData] = useState({ title: "", description: "" });
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

        fetch("/api/update_data") // Поменяйте на свой эндпоинт для получения данных
          .then((response) => response.json())
          .then((data) => {
            setData(data); // Устанавливаем данные для редактирования
          });
      })
      .catch(() => {
        localStorage.removeItem("token"); // Удаляем недействительный токен
        router.push("/login"); // Перенаправляем на страницу входа
      });
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    // Отправляем данные на сервер для сохранения
    fetch("/api/update_data.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Отправляем измененные данные
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage("Данные успешно сохранены!");
      })
      .catch((error) => {
        setMessage("Произошла ошибка при сохранении данных.");
      });
  };

  if (loading) {
    return <div className={styles.Loading}>Loading...</div>; // Отображаем индикатор загрузки
  }

  return (
    <section>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Добро пожаловать в Панель Администратора
        </h1>
        {user && (
          <div className={styles.userInfo}>
            <p>Email: {user.email}</p>
            <p>Роль: {user.role}</p>
          </div>
        )}

        {/* Форма для редактирования данных */}
        <div className={styles.editSection}>
          <h2>Редактирование данных</h2>
          <label htmlFor="title">Заголовок</label>
          <input
            type="text"
            id="title"
            name="title"
            value={data.title}
            onChange={handleChange}
            className={styles.input}
          />
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={handleChange}
            className={styles.textarea}
          />
          <button onClick={handleSave} className={styles.saveButton}>
            Сохранить
          </button>
        </div>

        {message && <p className={styles.message}>{message}</p>}

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
    </section>
  );
}

// "use client";

// import styles from "./admin.module.scss";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AdminPage() {
//   const router = useRouter();
//   const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
//   const [loading, setLoading] = useState(true); // Состояние загрузки страницы
//   const [data, setData] = useState({ title: "", description: "" });
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token"); // Получаем токен из localStorage
//     if (!token) {
//       router.push("/login"); // Если токена нет, перенаправляем на страницу входа
//       return;
//     }

//     // Проверяем токен через API
//     fetch("/api/protected", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Unauthorized");
//         return res.json();
//       })
//       .then((data) => {
//         setUser(data.user); // Устанавливаем данные пользователя
//         setLoading(false); // Убираем состояние загрузки
//       })
//       .catch(() => {
//         localStorage.removeItem("token"); // Удаляем недействительный токен
//         router.push("/login"); // Перенаправляем на страницу входа
//       });
//   }, [router]);

//   if (loading) {
//     return <div className={styles.Loading}>Loading...</div>; // Отображаем индикатор загрузки
//   }

//   return (
//     <section>
//       <div className={styles.container}>
//         <h1 className={styles.title}>
//           Добро пожаловать в Панель Администратора
//         </h1>
//         {user && (
//           <div className={styles.userInfo}>
//             <p>Email: {user.email}</p>
//             <p>Роль: {user.role}</p>
//           </div>
//         )}
//         <button
//           className={styles.logoutButton}
//           onClick={() => {
//             localStorage.removeItem("token"); // Удаляем токен
//             router.push("/login"); // Перенаправляем на страницу входа
//           }}
//         >
//           Выйти
//         </button>
//       </div>
//     </section>
//   );
// }
