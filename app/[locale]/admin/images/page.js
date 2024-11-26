'use client';

import { useEffect, useState } from 'react';

export default function ImagesPage() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch('/api/images'); // API для получения списка файлов
      const data = await res.json();
      setImages(data);
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h1>Uploaded Images</h1>
      <div>
        {images.map((image) => (
          <div key={image._id}>
            <img src={`/api/images/${image._id}`} alt={image.filename} width="200" />
          </div>
        ))}
      </div>
    </div>
  );
}
