"use client";

import styles from "./admin.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@nextui-org/react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
  const [loading, setLoading] = useState(true); // Состояние загрузки страницы
  const [file, setFile] = useState(null); // Состояние для данных из GitHub

  // Функция для получения данных из GitHub
  async function getData() {
    try {
      const response = await fetch(
        `https://api.github.com/repos/malahovskiyoleksandr/malahovskiy/contents/data/home.json`,
        {
          method: "GET",
          headers: {
            // "Authorization": `Bearer ${GITHUB_TOKEN}`, // если требуется токен
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при получении файла с GitHub");
      }

      const data = await response.json();
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return JSON.parse(content); // Возвращаем распарсенный JSON
    } catch (error) {
      console.error("Ошибка:", error.message);
    }
  }

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
    async function fetchData() {
      const data = await getData();
      setFile(data); // Сохраняем данные в состояние file
      setLoading(false); // Убираем состояние загрузки
    }

    fetchData(); // Вызов функции для получения данных
  }, []);

  // Обработка изменений в инпуте
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFile((prevFile) => ({
      ...prevFile,
      home: {
        ...prevFile.home,
        uk: { ...prevFile.home.uk, [name]: value },
      },
    }));
  };

  // Обработка отправки данных на GitHub
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

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = { ...file }; // Делаем копию данных
    handleFileUpload(updatedData); // Отправляем обновленные данные
  };

  if (loading) {
    return <div className={styles.Loading}>Loading...</div>;
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
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          Выйти
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input_list}>
          <h2>Имя</h2>
          <div className={styles.input_item}>
            <label className={styles.name}>UK</label>
            <input
              className={styles.input_title}
              type="text"
              name="name" // Имя должно быть таким, чтобы обновить нужное поле
              value={file?.home?.uk?.name || ""} // Заполняем инпут текущим значением из состояния
              onChange={handleChange} // Обрабатываем изменения
            />
          </div>
          <div className={styles.input_item}>
            <label className={styles.name}>UK</label>
            <textarea
              name="description"
              value={file?.home?.uk?.description || ""}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <button type="submit" className={styles.submitButton}>
          Сохранить
        </button>
      </form>
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
//   const [file, setFile] = useState(null); // Состояние для данных из GitHub

//   // Функция для получения данных из GitHub
//   async function getData() {
//     try {
//       const response = await fetch(
//         `https://api.github.com/repos/malahovskiyoleksandr/malahovskiy/contents/data/home.json`,
//         {
//           method: "GET",
//           headers: {
//             // "Authorization": `Bearer ${GITHUB_TOKEN}`, // если требуется токен
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Ошибка при получении файла с GitHub");
//       }

//       const data = await response.json();
//       const content = Buffer.from(data.content, "base64").toString("utf-8");
//       return JSON.parse(content); // Возвращаем распарсенный JSON
//     } catch (error) {
//       console.error("Ошибка:", error.message);
//     }
//   }

//   // Логика для получения информации о пользователе и проверки токена
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//       return;
//     }

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
//         localStorage.removeItem("token");
//         router.push("/login");
//       });
//   }, [router]);

//   // Загружаем данные с API
//   useEffect(() => {
//     async function fetchData() {
//       const data = await getData();
//       setFile(data); // Сохраняем данные в состояние file
//       setLoading(false); // Убираем состояние загрузки
//     }

//     fetchData(); // Вызов функции для получения данных
//   }, []);

//   // Обработка изменений в инпуте
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFile((prevFile) => ({
//       ...prevFile,
//       home: {
//         ...prevFile.home,
//         uk: { ...prevFile.home.uk, [name]: value },
//       },
//     }));
//   };

//   // Обработка отправки данных на GitHub
//   async function handleFileUpload(data) {
//     const filePath = "data/home.json";
//     const fileContent = JSON.stringify(data);
//     const commitMessage = "Обновление файла через API";

//     try {
//       const response = await fetch("/api/github-post", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ filePath, fileContent, commitMessage }),
//       });

//       if (!response.ok) {
//         throw new Error("Ошибка при загрузке файла.");
//       }

//       const responseData = await response.json();
//       console.log("Файл успешно обновлен:", responseData);
//       setFile(data); // Обновляем состояние с новыми данными
//     } catch (error) {
//       console.error("Ошибка при загрузке файла:", error.message);
//     }
//   }

//   // Обработка отправки формы
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const updatedData = { ...file }; // Делаем копию данных
//     handleFileUpload(updatedData); // Отправляем обновленные данные
//   };

//   if (loading) {
//     return <div className={styles.Loading}>Loading...</div>;
//   }

//   return (
//     <section className={styles.container}>
//       <h1 className={styles.title}>Ласкаво просимо до Панелі Адміністратора</h1>
//       <div className={styles.admin_header}>
//         {user && (
//           <div className={styles.userInfo}>
//             <p>Email: {user.email}</p>
//             <p>Роль: {user.role}</p>
//           </div>
//         )}
//         <button
//           className={styles.logoutButton}
//           onClick={() => {
//             localStorage.removeItem("token");
//             router.push("/login");
//           }}
//         >
//           Выйти
//         </button>
//       </div>

//       <form className={styles.form} onSubmit={handleSubmit}>
//         <div className={styles.input_list}>
//           <h2>Имя</h2>
//           <div className={styles.input_item}>
//             <label className={styles.name}>UK</label>
//             <input
//               className={styles.input_title}
//               type="text"
//               name="name" // Имя должно быть таким, чтобы обновить нужное поле
//               value={file?.home?.uk?.name || ""} // Заполняем инпут текущим значением из состояния
//               onChange={handleChange} // Обрабатываем изменения
//             />
//           </div>
//         </div>

//         <button type="submit" className={styles.submitButton}>
//           Сохранить
//         </button>
//       </form>
//     </section>
//   );
// }
