"use client";

import styles from "./admin.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody, Switch } from "@nextui-org/react";
import { Input } from "@nextui-org/react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
  const [loading, setLoading] = useState(true); // Состояние загрузки страницы
  const [file, setFile] = useState(null); // Состояние для данных из GitHub
  const [isVertical, setIsVertical] = useState(true);

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
      return JSON.parse(content);
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
      if (data) {
        setFile(data);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleChange = (e, lang) => {
    const { name, value } = e.target;

    setFile((prevFile) => ({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = { ...file }; // Делаем копию данных
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

      <div className="flex flex-col px-4">
        <Switch
          className="mb-4"
          isSelected={isVertical}
          onValueChange={setIsVertical}
        >
          Vertical
        </Switch>
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options" isVertical={isVertical}>
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
                            value={file.home?.[lang]?.name || ""}
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
                            value={file.home?.[lang]?.description || ""}
                            onChange={(e) => handleChange(e, lang)}
                          />
                        </div>
                      ))}
                    </div>

                    <button type="submit" className={styles.submitButton}>
                      Сохранить
                    </button>
                  </form>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="music" title="Галерея">
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
                            value={file.home?.[lang]?.name || ""}
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
                            value={file.home?.[lang]?.description || ""}
                            onChange={(e) => handleChange(e, lang)}
                          />
                        </div>
                      ))}
                    </div>

                    <button type="submit" className={styles.submitButton}>
                      Сохранить
                    </button>
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
    </div>
  );
}

// "use client";

// import styles from "./admin.module.scss";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Textarea } from "@nextui-org/react";

// export default function AdminPage() {
//   const router = useRouter();
//   const [user, setUser] = useState(null); // Состояние для хранения информации о пользователе
//   const [loading, setLoading] = useState(true); // Состояние загрузки страницы
//   const [file, setFile] = useState(null); // Состояние для данных из GitHub
//   const [activeTab, setActiveTab] = useState("home");

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

//     fetchData();
//   }, []);

//   const handleChange = (e, lang) => {
//     const { name, value } = e.target;

//     setFile((prevFile) => ({
//       ...prevFile,
//       home: {
//         ...prevFile.home,
//         [lang]: {
//           ...prevFile.home[lang],
//           [name]: value,
//         },
//       },
//     }));
//   };

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

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const updatedData = { ...file }; // Делаем копию данных
//     handleFileUpload(updatedData); // Отправляем обновленные данные
//   };

//   if (loading) {
//     return <div className={styles.Loading}>Loading...</div>;
//   }

//   return (
//     <div className={styles.adminPanel}>
//       <header className={styles.header}>
//         {user && (
//           <div className={styles.profile}>
//             {/* <img
//               src="/images/admin-avatar.jpg"
//               alt="Admin"
//               className={styles.avatar}
//             /> */}
//             <div>
//               <h2>User: {user.email}</h2>
//               <p>Role: {user.role}</p>
//             </div>
//           </div>
//         )}

//         <button
//           className={styles.logout}
//           onClick={() => {
//             localStorage.removeItem("token");
//             router.push("/login");
//           }}
//         >
//           Выйти
//         </button>
//       </header>

//       <div className={styles.content}>
//         <aside className={styles.sidebar}>
//           <ul>
//             <li
//               className={activeTab === "home" ? styles.active : ""}
//               onClick={() => setActiveTab("home")}
//             >
//               Главная
//             </li>
//             <li
//               className={activeTab === "gallery" ? styles.active : ""}
//               onClick={() => setActiveTab("gallery")}
//             >
//               Галерея
//             </li>
//             <li
//               className={activeTab === "events" ? styles.active : ""}
//               onClick={() => setActiveTab("events")}
//             >
//               События
//             </li>
//           </ul>
//         </aside>

//         <main className={styles.editor}>
//           <h1>Редактирование: {activeTab}</h1>
//           <form className={styles.form} onSubmit={handleSubmit}>
//             {/* Name inputs */}
//             <div className={styles.inputList}>
//               <h2>Имя</h2>
//               {["uk", "en", "de"].map((lang) => (
//                 <div className={styles.inputItem} key={lang}>
//                   <label className={styles.label}>{lang.toUpperCase()}</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={file.home?.[lang]?.name || ""}
//                     onChange={(e) => handleChange(e, lang)}
//                     className={styles.input}
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Description inputs */}
//             <div className={styles.textareaList}>
//               <h2>Описание</h2>
//               {["uk", "en", "de"].map((lang) => (
//                 <div className={styles.textareaItem} key={lang}>
//                   <label className={styles.label}>{lang.toUpperCase()}</label>
//                   <textarea
//                     name="description"
//                     value={file.home?.[lang]?.description || ""}
//                     onChange={(e) => handleChange(e, lang)}
//                     className={styles.textarea}
//                   ></textarea>
//                 </div>
//               ))}
//             </div>

//             <button type="submit" className={styles.submitButton}>
//               Сохранить
//             </button>
//           </form>
//         </main>
//       </div>
//     </div>
//   );
// }
