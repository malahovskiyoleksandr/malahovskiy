'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
  const [loading, setLoading] = useState(true); // Состояние загрузки страницы

  useEffect(() => {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    if (!token) {
      router.push('/login'); // Если токена нет, перенаправляем на страницу входа
      return;
    }

    // Проверяем токен через API
    fetch('/api/protected', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => {
        setUser(data.user); // Устанавливаем данные пользователя
        setLoading(false); // Убираем состояние загрузки
      })
      .catch(() => {
        localStorage.removeItem('token'); // Удаляем недействительный токен
        router.push('/login'); // Перенаправляем на страницу входа
      });
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Отображаем индикатор загрузки
  }

  return (
    <div>
      <h1>Welcome to the Admin Panel</h1>
      {user && (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
      <button
        onClick={() => {
          localStorage.removeItem('token'); // Удаляем токен
          router.push('/login'); // Перенаправляем на страницу входа
        }}
      >
        Logout
      </button>
    </div>
  );
}

// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function AdminPage() {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push('/login'); // Перенаправление на страницу входа
//       return;
//     }

//     // Проверка токена через API
//     fetch('/api/protected', {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error('Unauthorized');
//       })
//       .catch(() => {
//         localStorage.removeItem('token');
//         router.push('/login');
//       });
//   }, []);

//   return <div>Welcome to the Admin Panel!</div>;
// }
