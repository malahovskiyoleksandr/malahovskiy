import { useState, useEffect } from "react";

export default function EditDataPage() {
  const [data, setData] = useState({ title: "", description: "" });
  const [message, setMessage] = useState("");

  // Загружаем текущие данные
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    const response = await fetch("/api/update-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setMessage("Данные успешно обновлены!");
    } else {
      setMessage("Ошибка при обновлении данных.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Редактирование данных</h1>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Заголовок:
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            style={{ marginLeft: "10px", width: "300px" }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Описание:
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            style={{ marginLeft: "10px", width: "300px", height: "100px" }}
          />
        </label>
      </div>
      <button onClick={handleSave} style={{ padding: "10px 20px", cursor: "pointer" }}>
        Сохранить
      </button>
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}
