"use client";

import styles from "./admin.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
  const [loading, setLoading] = useState(true); // Состояние загрузки страницы

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
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Отображаем индикатор загрузки
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Добро пожаловать в Панель Администратора</h1>
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
  );
}
