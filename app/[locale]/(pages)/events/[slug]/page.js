import styles from "./event.module.scss";
import Image from "next/image";
import { EventsData } from "../events";
// import { redirect } from "next/navigation";

export async function generateStaticParams({ params }) {
  const { locale } = params;
  // console.log(locale)
  const events = await EventsData();

  return events.map((event) => ({
    slug: event[locale].title, // формируем slug на основе локали
  }));
}

export default async function EventPage({ params }) {
  const { slug, locale } = params;
  console.log(locale)
  const decodedSlug = decodeURIComponent(slug);
  // const encodedSlug = encodeURIComponent();

  // Получение events с базы данных
  const events = await EventsData();
  
  // redirect(`/${locale}/events/${encodeURIComponent(localizedSlug)}`);

  // Находим событие по текущему `slug`
  const event = events.find((event) => event[locale].title === decodedSlug);

  if (!event) {
    return <h1>Event not found</h1>;
  }

  return (
    <section className={styles.main_block}>
      <div className={styles.event}>
        <span className={styles.event_data}>28 жовтня 2024</span>
        <h1 className={styles.event_name}>{event[locale].title}</h1>
        {console.log(event)}
        <p className={styles.event__description}>{event[locale].description}</p>
        <p className={styles.event__description_content}>
          {event[locale].content}
        </p>
      </div>
    </section>
  );
}
// export const revalidate = 60;
