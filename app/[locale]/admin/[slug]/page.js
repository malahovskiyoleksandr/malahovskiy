"use client";

import React from "react";
import styles from "./event.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { Textarea, Button, Spinner } from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody, Input } from "@nextui-org/react";

export default function EventPage({ params }) {
  const { slug, locale } = params;
  const [database, setDatabase] = useState();
  const [fullDatabase, setFullDatabase] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventIndex, setEventIndex] = useState(null);

  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/github-get");
        if (!response.ok) {
          throw new Error("Помилка завантаження даних");
        }
        const data = await response.json();

        const index = data.events.findIndex(
          (event) => generateSlug(event.title["en"]) === slug
        );

        if (index === -1) {
          throw new Error("Event not found");
        }

        setFullDatabase(data);
        setDatabase(data.events[index]);
        setEventIndex(index);
      } catch (error) {
        console.error("Error: fetch(github-get)", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [slug]);

  useEffect(() => {
    let lightbox;

    if (typeof window !== "undefined") {
      lightbox = new PhotoSwipeLightbox({
        gallery: "#gallery",
        children: "a",
        pswpModule: () => import("photoswipe"),
        wheelToZoom: true,
      });
      lightbox.init();
    }

    return () => {
      if (lightbox) lightbox.destroy();
    };
  }, [database]);

  const handleChange = (e, path) => {
    const { value } = e.target;

    setDatabase((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let target = updated;

      keys.slice(0, -1).forEach((key) => {
        target = target[key];
      });

      target[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const updatedFullDatabase = { ...fullDatabase };
      updatedFullDatabase.events[eventIndex] = database;

      const payload = {
        filePath: "data/database.json",
        fileContent: JSON.stringify(updatedFullDatabase, null, 2),
        commitMessage: "Updated event via admin panel",
      };

      const response = await fetch("/api/github-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      const result = await response.json();
      console.log("Changes saved successfully:", result);
    } catch (error) {
      console.error("Error saving:", error.message);
      alert("Помилка! Невдале збереження");
    } finally {
      setIsSubmitting(false);
      alert("Успішне збереження");
    }
  };

  const handleDeleteBlock = (index) => {
    setDatabase((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  const handleMoveBlock = (index, direction) => {
    setDatabase((prev) => {
      const newContent = [...prev.content];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= newContent.length) {
        return prev;
      }

      // Перемещение блоков
      const temp = newContent[index];
      newContent[index] = newContent[targetIndex];
      newContent[targetIndex] = temp;

      return { ...prev, content: newContent };
    });
  };

  const handleAddTextBlock = () => {
    setDatabase((prev) => ({
      ...prev,
      content: [
        ...prev.content,
        {
          type: "text",
          value: { uk: "", en: "", de: "" },
        },
      ],
    }));
  };

  const handleAddImageBlock = () => {
    setDatabase((prev) => ({
      ...prev,
      content: [
        ...prev.content,
        {
          type: "image",
          src: "",
          description: { uk: "", en: "", de: "" },
        },
      ],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[95vh]">
        <Spinner color="warning" label="Loading" labelColor="warning" />
      </div>
    );
  }

  if (!database) {
    return (
      <div className="flex items-center justify-center h-[95vh]">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <section className={styles.main_block}>
      <header className={styles.header}>
        <Button
          className={styles.save_button}
          color="success"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Зберегти"}
        </Button>
        {/* <div className={styles.buttons}> */}
        <Button onClick={handleAddTextBlock} color="primary">
          Add Text Block
        </Button>
        <Button onClick={handleAddImageBlock} color="secondary">
          Add Image Block
        </Button>
        {/* </div> */}
      </header>
      <div className={styles.event}>
        <Tabs aria-label="Localized Titles" className={styles.name_events}>
          {["uk", "en", "de"].map((lang, index) => (
            <Tab key={lang} title={lang.toUpperCase()}>
              <Card>
                <CardBody>
                  <Textarea
                    className={styles.name_events_textarea}
                    label={`Назва заходу (${lang.toUpperCase()})`}
                    value={database.title[lang]}
                    onChange={(e) => handleChange(e, `title.${lang}`)}
                  />
                </CardBody>
              </Card>
            </Tab>
          ))}
        </Tabs>

        <Input
          className={styles.input_date}
          label="Дата заходу"
          value={database.date}
          onChange={(e) => handleChange(e, "date")}
        />

        <div className={styles.event_content}>
          {database.content.map((block, index) => {
            if (block.type === "text") {
              return (
                <div key={index} className={styles.block_type_text}>
                  <Tabs aria-label={`Text Block ${index}`}>
                    {["uk", "en", "de"].map((lang, index_leng) => (
                      <Tab key={lang} title={lang.toUpperCase()}>
                        <Card>
                          <CardBody>
                            <Textarea
                              className={styles.block_type_text__textarea}
                              label={`Text Content (${lang.toUpperCase()})`}
                              value={block.value[lang]}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  `content.${index}.value.${lang}`
                                )
                              }
                            />
                          </CardBody>
                        </Card>
                      </Tab>
                    ))}
                  </Tabs>
                  <div className={styles.block_actions}>
                    <Button onClick={() => handleMoveBlock(index, "up")}>
                      Up
                    </Button>
                    <Button onClick={() => handleMoveBlock(index, "down")}>
                      Down
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => handleDeleteBlock(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            }

            if (block.type === "image") {
              return (
                <div key={index} className={styles.block_type_image}>
                  <Image
                    className={styles.block_type_image__image}
                    // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                    // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                    alt={block.description[locale]}
                    src={block.src}
                    // placeholder="blur" // размытие заднего фона при загрузке картинки
                    // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
                    quality={100} //качество картнки в %
                    priority={true} // если true - loading = 'lazy' отменяеться
                    // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
                    fill={false} //заставляет изображение заполнять родительский элемент
                    // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // предоставляет информацию о том, насколько широким будет изображение в разных контрольных точках
                    sizes="100%"
                    width={300} // задать правильное соотношение сторон адаптивного изображения
                    height={200}
                    style={
                      {
                        // width: "200px",
                        // height: "200px",
                        // objectFit: "cover", // Изображение масштабируется, обрезая края
                        // objectFit: "contain", // Изображение масштабируется, не обрезаясь
                        // objectPosition: "top",
                        // margin: "0 0 1rem 0",
                      }
                    }
                  />
                  <Textarea
                    className={styles.block_type_image__textarea}
                    label="Опис картинки (BETA)"
                    value={block.description[locale]}
                    onChange={(e) =>
                      handleChange(e, `content.${index}.description.${locale}`)
                    }
                  />
                  <Input
                    className={styles.block_type_image__input}
                    label="Розташування зображення"
                    value={block.src}
                    onChange={(e) => handleChange(e, `content.${index}.src`)}
                  />
                  <div className={styles.block_actions}>
                    <Button onClick={() => handleMoveBlock(index, "up")}>
                      Up
                    </Button>
                    <Button onClick={() => handleMoveBlock(index, "down")}>
                      Down
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => handleDeleteBlock(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            }

            if (block.type === "imageS") {
              return (
                <div
                  id="gallery"
                  key={index}
                  className={styles.block_type_imageS}
                >
                  {block.src.map((image, subIndex) => (
                    <a
                      className={styles.block_type_imageS__link}
                      key={subIndex}
                      href={image.href}
                      data-pswp-width={image.width}
                      data-pswp-height={image.height}
                      data-id={image.href}
                    >
                      <Image
                        id={image.href}
                        className={styles.block_type_imageS__image}
                        // onLoad={(e) => console.log(e.target.naturalWidth)} // вызов функции после того как картинка полностью загрузится
                        // onError={(e) => console.error(e.target.id)} // Функция обратного вызова, которая вызывается, если изображение не загружается.
                        alt={`Image ${subIndex}`}
                        src={image.href}
                        // placeholder="blur" // размытие заднего фона при загрузке картинки
                        // blurDataURL="/path-to-small-blurry-version.jpg"  // если включено свойство placeholder="blur" и картинка без импорта - добавляем сжатое/размытое изображение
                        quality={100} //качество картнки в %
                        priority={true} // если true - loading = 'lazy' отменяеться
                        // loading="lazy" // {lazy - загрузка картинки в области просмотра} | {eager - немедленная загрузка картинки}
                        fill={false} //заставляет изображение заполнять родительский элемент
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        width={300} // задать правильное соотношение сторон адаптивного изображения
                        height={200}
                        style={
                          {
                            // width: "200px",
                            // height: "200px",
                            // objectFit: "cover", // Изображение масштабируется, обрезая края
                            // objectFit: "contain", // Изображение масштабируется, не обрезаясь
                            // objectPosition: "top",
                            // margin: "0 0 1rem 0",
                          }
                        }
                      />
                    </a>
                  ))}
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </section>
  );
}






// "use client";

// import React from "react";
// import Image from "next/image";
// import styles from "./event.module.scss";
// import { useEffect, useState } from "react";
// import PhotoSwipeLightbox from "photoswipe/lightbox";
// import { Textarea, Button, Input, Spinner } from "@nextui-org/react";

// export default function EventPage({ params }) {
//   const { slug, locale } = params;
//   const [database, setDatabase] = useState();
//   const [fullDatabase, setFullDatabase] = useState();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [eventIndex, setEventIndex] = useState(null);

//   function generateSlug(title) {
//     return title
//       .toLowerCase()
//       .replace(/ /g, "-")
//       .replace(/[^\w-]+/g, "");
//   }

//   useEffect(() => {
//     if (!slug) return;

//     const loadData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch("/api/github-get");
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data = await response.json();

//         const index = data.events.findIndex(
//           (event) => generateSlug(event.title["en"]) === slug
//         );

//         if (index === -1) {
//           throw new Error("Event not found");
//         }

//         setFullDatabase(data);
//         setDatabase(data.events[index]);
//         setEventIndex(index);
//       } catch (error) {
//         console.error("Error: fetch(github-get)", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, [slug]);

//   useEffect(() => {
//     let lightbox;

//     if (typeof window !== "undefined") {
//       lightbox = new PhotoSwipeLightbox({
//         gallery: "#gallery",
//         children: "a",
//         pswpModule: () => import("photoswipe"),
//         wheelToZoom: true,
//       });
//       lightbox.init();
//     }

//     return () => {
//       if (lightbox) lightbox.destroy();
//     };
//   }, [database]);

//   const handleChange = (e, path) => {
//     const { value } = e.target;

//     setDatabase((prev) => {
//       const updated = { ...prev };
//       const keys = path.split(".");
//       let target = updated;

//       keys.slice(0, -1).forEach((key) => {
//         target = target[key];
//       });

//       target[keys[keys.length - 1]] = value;
//       return updated;
//     });
//   };

//   const handleAddTextBlock = () => {
//     setDatabase((prev) => ({
//       ...prev,
//       content: [
//         ...prev.content,
//         {
//           type: "text",
//           value: { uk: "", en: "", de: "" },
//         },
//       ],
//     }));
//   };

//   const handleAddImageBlock = () => {
//     setDatabase((prev) => ({
//       ...prev,
//       content: [
//         ...prev.content,
//         {
//           type: "image",
//           src: "",
//           description: { uk: "", en: "", de: "" },
//         },
//       ],
//     }));
//   };

//   const handleDeleteBlock = (index) => {
//     setDatabase((prev) => ({
//       ...prev,
//       content: prev.content.filter((_, i) => i !== index),
//     }));
//   };

//   const handleMoveBlock = (index, direction) => {
//     setDatabase((prev) => {
//       const newContent = [...prev.content];
//       const targetIndex = direction === "up" ? index - 1 : index + 1;

//       if (targetIndex < 0 || targetIndex >= newContent.length) {
//         return prev;
//       }

//       // Перемещение блоков
//       const temp = newContent[index];
//       newContent[index] = newContent[targetIndex];
//       newContent[targetIndex] = temp;

//       return { ...prev, content: newContent };
//     });
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);

//     try {
//       const updatedFullDatabase = { ...fullDatabase };
//       updatedFullDatabase.events[eventIndex] = database;

//       const payload = {
//         filePath: "data/database.json",
//         fileContent: JSON.stringify(updatedFullDatabase, null, 2),
//         commitMessage: "Updated event via admin panel",
//       };

//       const response = await fetch("/api/github-post", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update data");
//       }

//       const result = await response.json();
//       console.log("Changes saved successfully:", result);
//     } catch (error) {
//       console.error("Error saving:", error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-[95vh]">
//         <Spinner color="warning" label="Loading" labelColor="warning" />
//       </div>
//     );
//   }

//   if (!database) {
//     return (
//       <div className="flex items-center justify-center h-[95vh]">
//         <p>Event not found</p>
//       </div>
//     );
//   }

//   return (
//     <section className={styles.main_block}>
//       <div className={styles.event}>
//         {database.title &&
//           Object.entries(database.title).map(([key, value], index) => (
//             <div
//               key={key}
//               className={styles.block}
//               style={{
//                 margin: "2rem 0",
//               }}
//             >
//               <Input
//                 // key={key + index}
//                 label={`Text Block (${key.toUpperCase()})`}
//                 value={value}
//                 onChange={(e) => handleChange(e, `title.${key}`)}
//               />
//               <div className={styles.block_actions}>
//                 <Button onClick={() => handleMoveBlock(index, "up")}>
//                   Move Up
//                 </Button>
//                 <Button onClick={() => handleMoveBlock(index, "down")}>
//                   Move Down
//                 </Button>
//                 <Button color="danger" onClick={() => handleDeleteBlock(index)}>
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           ))}
//         <div className={styles.event_content}>
//           {database.content.map((block, index) => {
//             if (block.type === "text") {
//               return (
//                 <div
//                   key={block.id}
//                   className={styles.block}
//                   style={{
//                     margin: "2rem 0",
//                   }}
//                 >
//                   <Textarea
//                     label={`Text Block (${locale.toUpperCase()})`}
//                     value={block.value[locale]}
//                     onChange={(e) =>
//                       handleChange(e, `content.${index}.value.${locale}`)
//                     }
//                   />
//                   <div className={styles.block_actions}>
//                     <Button onClick={() => handleMoveBlock(index, "up")}>
//                       Move Up
//                     </Button>
//                     <Button onClick={() => handleMoveBlock(index, "down")}>
//                       Move Down
//                     </Button>
//                     <Button
//                       color="danger"
//                       onClick={() => handleDeleteBlock(index)}
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               );
//             }

//             if (block.type === "image") {
//               return (
//                 <div key={block.id} className={styles.block}>
//                   <Image
//                     src={block.src}
//                     alt={block.description[locale] || "Image"}
//                     width={300}
//                     height={200}
//                   />
//                   <Input
//                     label="Image URL"
//                     value={block.src}
//                     onChange={(e) => handleChange(e, `content.${index}.src`)}
//                   />
//                   <Textarea
//                     label={`Image Description (${locale.toUpperCase()})`}
//                     value={block.description[locale]}
//                     onChange={(e) =>
//                       handleChange(e, `content.${index}.description.${locale}`)
//                     }
//                   />
//                   <div
//                     className={styles.block_actions}
//                     style={{
//                       margin: "2rem 0",
//                     }}
//                   >
//                     <Button onClick={() => handleMoveBlock(index, "up")}>
//                       Move Up
//                     </Button>
//                     <Button onClick={() => handleMoveBlock(index, "down")}>
//                       Move Down
//                     </Button>
//                     <Button
//                       color="danger"
//                       onClick={() => handleDeleteBlock(index)}
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               );
//             }
//             return null;
//           })}
//         </div>

//         <div className={styles.buttons}>
//           <Button onClick={handleAddTextBlock} color="primary">
//             Add Text Block
//           </Button>
//           <Button onClick={handleAddImageBlock} color="secondary">
//             Add Image Block
//           </Button>
//         </div>

//         <Button color="success" onClick={handleSubmit} disabled={isSubmitting}>
//           {isSubmitting ? "Saving..." : "Save Changes"}
//         </Button>
//       </div>
//     </section>
//   );
// }