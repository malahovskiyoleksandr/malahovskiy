'use client';

import { useState } from 'react';
import styles from './login.module.scss';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token); // Сохраняем токен
      alert('Вхід успішний!');
      window.location.href = '/admin'; // Перенаправляем на админку
    } else {
      alert('Не вiрний логiн або пароль');
    }
  };

  return (
    <div className={styles.container}>
    <h1 className={styles.title}>Вход</h1>
    <form onSubmit={handleLogin} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          type="email"
          id="email"
          placeholder="Введите email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="password" className={styles.label}>Пароль</label>
        <input
          type="password"
          id="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
      </div>
      <button type="submit" className={styles.button}>Войти</button>
    </form>
    <a href="/forgot-password" className={styles.link}>Забыли пароль?</a>
  </div>
    // <form onSubmit={handleLogin}>
    //   <h1>Login</h1>
    //   <input
    //     type="email"
    //     placeholder="Email"
    //     value={email}
    //     onChange={(e) => setEmail(e.target.value)}
    //   />
    //   <input
    //     type="password"
    //     placeholder="Password"
    //     value={password}
    //     onChange={(e) => setPassword(e.target.value)}
    //   />
    //   <button type="submit">Login</button>
    // </form>
  );
}
