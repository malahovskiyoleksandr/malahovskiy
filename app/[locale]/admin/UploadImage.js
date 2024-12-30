import React, { useState } from "react";

function UploadImage({ onUpload }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      // Отправляем файл на API для загрузки на GitHub
      const response = await fetch("/api/github-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Ошибка загрузки изображения");
      }

      const result = await response.json();
      onUpload(result.filePath); // Возвращаем путь нового файла в админку
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      alert("Не удалось загрузить изображение");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label htmlFor="file-upload" style={{ cursor: "pointer", display: "block" }}>
        {isUploading ? "Загрузка..." : "Загрузить изображение"}
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default UploadImage;
