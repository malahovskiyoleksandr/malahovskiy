export async function EventsData() {
  const events = [
    // Добавьте другие мероприятия
    {
      id: 1,
      uk: {
        title:"У Кам’янському презентували мистецький проєкт «POST MOST 6 Reconnect»",
        description:"19 жовтня у Музеї історії міста відбулася презентація проєкту «POST MOST 6 Reconnect», який об’єднав 16 українських художників із різних міст та країн.",
        content:"Ініціатива, започаткована у Маріуполі ще в 2019 році, продовжує жити та розвиватися, навіть попри складні часи. Цьогоріч виставка стала справжнім культурним мостом, що об’єднав митців з Маріуполя, Кам’янського, Кривого Рогу та Києва, а також їхніх колег із Німеччини та Австрії. Під час відкриття гості музею мали змогу не лише ознайомитися з мистецькими роботами, а й поспілкуватися з авторами через відеозв’язок. Атмосферу доповнювали кавер-версії відомих пісень, виконані музикантами.",
      },
      en: {
        title:"The artistic project «POST MOST 6 Reconnect» was presented in Kamianskyi",
        description:"On October 19, the Museum of the History of the City hosted the presentation of the «POST MOST 6 Reconnect» project, which united 16 Ukrainian artists from different cities and countries.",
        content:"The initiative, launched in Mariupol back in 2019, continues to live and develop, even in difficult times. This year, the exhibition became a real cultural bridge that united artists from Mariupol, Kamiansk, Kryvyi Rih and Kyiv, as well as their colleagues from Germany and Austria. During the opening, museum guests had the opportunity not only to familiarize themselves with the works of art, but also to communicate with the authors via video link. The atmosphere was complemented by cover versions of famous songs performed by musicians.",
      },
      de: {
        title:"Das künstlerische Projekt «POST MOST 6 Reconnect» wurde in Kamianskyi präsentiert",
        description:"Am 19. Oktober fand im Museum für Stadtgeschichte die Präsentation des Projekts «POST MOST 6 Reconnect» statt, bei dem 16 ukrainische Künstler aus verschiedenen Städten und Ländern zusammenkamen.",
        content:"Die bereits 2019 in Mariupol ins Leben gerufene Initiative lebt und entwickelt sich auch in schwierigen Zeiten weiter. In diesem Jahr wurde die Ausstellung zu einer echten kulturellen Brücke, die Künstler aus Mariupol, Kamjansk, Krywyj Rih und Kiew sowie ihre Kollegen aus Deutschland und Österreich vereinte. Während der Eröffnung hatten Museumsgäste nicht nur die Möglichkeit, sich mit den Kunstwerken vertraut zu machen, sondern auch per Videoschaltung mit den Autoren zu kommunizieren. Ergänzt wurde die Atmosphäre durch von Musikern vorgetragene Coverversionen berühmter Lieder.",
      },
      main_image: "/images/events/dsc0237.jpg",
      photoGallery: [
        {
          src:  "/images/events/POST_MOST_6_Reconnect.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0237.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0180.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0189.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0201.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0205.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0239.jpg",
          type: "image",
          description: "Назва картини"
        },
      ],
    },
    {
      id: 2,
      uk: {
        title:"Запрошуємо Вас на відкриття художньої виставки проєкту «ПОСТ МОСТ»",
        description:"Художній проєкт «ПОСТ МОСТ» був заснований у 2017 році у Маріуполі як щорічна резиденція та виставка художніх творів для митців з багатьох міст України та Європи",
        content:"Засновниками проєкту були члени громадської організації 'ARS ALTERA'. У 2023 році художники з Маріуполя, Кам'янського, Києва та Одеси були на екскурсії у цехах комбінату «КАМЕТ-СТАЛЬ», їх роботи були присвячені індустріальної складової міст України. Цього року до проєкту знов приєдналися постійні учасники громадської організації 'ARS ALTERA' з новими ідеями та наративами, тому проєкт отримав назву «POST MOST 6 Reconnect».\nНа виставці будуть представлені роботи сучасних тематик 16 художників, актуальні риси яких митці хочуть зараз донести глядачу.\nНа відкритті за допомогою відео зв’язку глядачі зможуть поспілкуватись з художниками проєкту, які знаходяться у різних містах та странах, а музиканти наживо подарують присутнім кавер-версії відомих пісень. Запрошуємо Вас на відкриття виставки 19 жовтня о 12:00 у Музей історії міста Кам’янського за адресою: проспект Свободи, 39",  
      },
      en: {
        title:"We invite you to the opening of the art exhibition of the «POST MOST» project",
        description:"The art project «POST MOST» was founded in 2017 in Mariupol as an annual residence and exhibition of works of art for artists from many cities of Ukraine and Europe",
        content:"The founders of the project were members of the public organization 'ARS ALTERA'. In 2023, artists from Mariupol, Kamiansk, Kyiv and Odesa went on a tour of the workshops of the «KAMET-STEEL» combine, their works were dedicated to the industrial component of the cities of Ukraine. This year permanent members of the public organization 'ARS ALTERA' joined the project again with new ideas and narratives, therefore the project was named «POST MOST 6 Reconnect». nAt the opening, the audience will be able to communicate with the artists of the project, who are in different cities and countries, via video link, and the musicians will present live cover versions of famous songs to the audience. We invite you to the opening of the exhibition on October 19 at 12:00 in the Museum of the History of the City Kamianskyi at the address: 39 Svoboda Avenue",  
      },
      de: {
        title:"Wir laden Sie zur Eröffnung der Kunstausstellung des Projekts «POST MOST» ein",
        description:"Das Kunstprojekt «POST MOST» wurde 2017 in Mariupol als jährliche Residenz und Ausstellung von Kunstwerken für Künstler aus vielen Städten der Ukraine und Europas gegründet",
        content:"Die Gründer des Projekts waren Mitglieder der öffentlichen Organisation „ARS ALTERA“. Im Jahr 2023 besuchten Künstler aus Mariupol, Kamjansk, Kiew und Odessa die Werkstätten des Kombinats „KAMET-STEEL“, deren Werke der industriellen Komponente der Städte der Ukraine gewidmet waren. In diesem Jahr beteiligten sich wieder reguläre Mitglieder der öffentlichen Organisation „ARS ALTERA“ mit neuen Ideen und Erzählungen am Projekt, weshalb das Projekt den Namen „POST MOST 6 Reconnect“ erhielt. Die Ausstellung präsentiert Werke von 16 Künstlern zu modernen Themen, deren aktuelle Aspekte die Künstler nun dem Publikum vermitteln wollen. Bei der Eröffnung kann das Publikum mit den in verschiedenen Städten und Ländern ansässigen Künstlern des Projekts kommunizieren und die Musiker werden dem Publikum per Videokommunikation Live-Coverversionen berühmter Songs präsentieren. Wir laden Sie zur Eröffnung der Ausstellung am 19. Oktober um 12:00 Uhr im Museum der Geschichte der Stadt Kamiansky unter der Adresse: Prospect Svobody, 39 ein",  
      },
      main_image: "/images/events/post_most_reconnect.jpg",
      // photoGallery: [
      //   {
      //     src:  "/images/events/dsc0237.jpg",
      //     type: "image",
      //     description: "Назва картини"
      //   },
      // ],
    },
    {
      id: 3,
      uk: {
        title:"У Кам’янському презентували мистецький проєкт «POST MOST 6 Reconnect»",
        description:"19 жовтня у Музеї історії міста відбулася презентація проєкту «POST MOST 6 Reconnect», який об’єднав 16 українських художників із різних міст та країн.",
        content:"Ініціатива, започаткована у Маріуполі ще в 2019 році, продовжує жити та розвиватися, навіть попри складні часи. Цьогоріч виставка стала справжнім культурним мостом, що об’єднав митців з Маріуполя, Кам’янського, Кривого Рогу та Києва, а також їхніх колег із Німеччини та Австрії. Під час відкриття гості музею мали змогу не лише ознайомитися з мистецькими роботами, а й поспілкуватися з авторами через відеозв’язок. Атмосферу доповнювали кавер-версії відомих пісень, виконані музикантами.",
      },
      en: {
        title:"The artistic project «POST MOST 6 Reconnect» was presented in Kamianskyi",
        description:"On October 19, the Museum of the History of the City hosted the presentation of the «POST MOST 6 Reconnect» project, which united 16 Ukrainian artists from different cities and countries.",
        content:"The initiative, launched in Mariupol back in 2019, continues to live and develop, even in difficult times. This year, the exhibition became a real cultural bridge that united artists from Mariupol, Kamiansk, Kryvyi Rih and Kyiv, as well as their colleagues from Germany and Austria. During the opening, museum guests had the opportunity not only to familiarize themselves with the works of art, but also to communicate with the authors via video link. The atmosphere was complemented by cover versions of famous songs performed by musicians.",
      },
      de: {
        title:"Das künstlerische Projekt «POST MOST 6 Reconnect» wurde in Kamianskyi präsentiert",
        description:"Am 19. Oktober fand im Museum für Stadtgeschichte die Präsentation des Projekts «POST MOST 6 Reconnect» statt, bei dem 16 ukrainische Künstler aus verschiedenen Städten und Ländern zusammenkamen.",
        content:"Die bereits 2019 in Mariupol ins Leben gerufene Initiative lebt und entwickelt sich auch in schwierigen Zeiten weiter. In diesem Jahr wurde die Ausstellung zu einer echten kulturellen Brücke, die Künstler aus Mariupol, Kamjansk, Krywyj Rih und Kiew sowie ihre Kollegen aus Deutschland und Österreich vereinte. Während der Eröffnung hatten Museumsgäste nicht nur die Möglichkeit, sich mit den Kunstwerken vertraut zu machen, sondern auch per Videoschaltung mit den Autoren zu kommunizieren. Ergänzt wurde die Atmosphäre durch von Musikern vorgetragene Coverversionen berühmter Lieder.",
      },
      main_image: "/images/events/POST_MOST_6_Reconnect.jpg",
      photoGallery: [
        {
          src:  "/images/events/dsc0237.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0180.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0189.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0201.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0205.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0239.jpg",
          type: "image",
          description: "Назва картини"
        },
      ],
    },
    {
      id: 4,
      uk: {
        title:"Запрошуємо Вас на відкриття художньої виставки проєкту «ПОСТ МОСТ»",
        description:"Художній проєкт «ПОСТ МОСТ» був заснований у 2017 році у Маріуполі як щорічна резиденція та виставка художніх творів для митців з багатьох міст України та Європи",
        content:"Засновниками проєкту були члени громадської організації 'ARS ALTERA'. У 2023 році художники з Маріуполя, Кам'янського, Києва та Одеси були на екскурсії у цехах комбінату «КАМЕТ-СТАЛЬ», їх роботи були присвячені індустріальної складової міст України. Цього року до проєкту знов приєдналися постійні учасники громадської організації 'ARS ALTERA' з новими ідеями та наративами, тому проєкт отримав назву «POST MOST 6 Reconnect».\nНа виставці будуть представлені роботи сучасних тематик 16 художників, актуальні риси яких митці хочуть зараз донести глядачу.\nНа відкритті за допомогою відео зв’язку глядачі зможуть поспілкуватись з художниками проєкту, які знаходяться у різних містах та странах, а музиканти наживо подарують присутнім кавер-версії відомих пісень. Запрошуємо Вас на відкриття виставки 19 жовтня о 12:00 у Музей історії міста Кам’янського за адресою: проспект Свободи, 39",  
      },
      en: {
        title:"We invite you to the opening of the art exhibition of the «POST MOST» project",
        description:"The art project «POST MOST» was founded in 2017 in Mariupol as an annual residence and exhibition of works of art for artists from many cities of Ukraine and Europe",
        content:"The founders of the project were members of the public organization 'ARS ALTERA'. In 2023, artists from Mariupol, Kamiansk, Kyiv and Odesa went on a tour of the workshops of the «KAMET-STEEL» combine, their works were dedicated to the industrial component of the cities of Ukraine. This year permanent members of the public organization 'ARS ALTERA' joined the project again with new ideas and narratives, therefore the project was named «POST MOST 6 Reconnect». nAt the opening, the audience will be able to communicate with the artists of the project, who are in different cities and countries, via video link, and the musicians will present live cover versions of famous songs to the audience. We invite you to the opening of the exhibition on October 19 at 12:00 in the Museum of the History of the City Kamianskyi at the address: 39 Svoboda Avenue",  
      },
      de: {
        title:"Wir laden Sie zur Eröffnung der Kunstausstellung des Projekts «POST MOST» ein",
        description:"Das Kunstprojekt «POST MOST» wurde 2017 in Mariupol als jährliche Residenz und Ausstellung von Kunstwerken für Künstler aus vielen Städten der Ukraine und Europas gegründet",
        content:"Die Gründer des Projekts waren Mitglieder der öffentlichen Organisation „ARS ALTERA“. Im Jahr 2023 besuchten Künstler aus Mariupol, Kamjansk, Kiew und Odessa die Werkstätten des Kombinats „KAMET-STEEL“, deren Werke der industriellen Komponente der Städte der Ukraine gewidmet waren. In diesem Jahr beteiligten sich wieder reguläre Mitglieder der öffentlichen Organisation „ARS ALTERA“ mit neuen Ideen und Erzählungen am Projekt, weshalb das Projekt den Namen „POST MOST 6 Reconnect“ erhielt. Die Ausstellung präsentiert Werke von 16 Künstlern zu modernen Themen, deren aktuelle Aspekte die Künstler nun dem Publikum vermitteln wollen. Bei der Eröffnung kann das Publikum mit den in verschiedenen Städten und Ländern ansässigen Künstlern des Projekts kommunizieren und die Musiker werden dem Publikum per Videokommunikation Live-Coverversionen berühmter Songs präsentieren. Wir laden Sie zur Eröffnung der Ausstellung am 19. Oktober um 12:00 Uhr im Museum der Geschichte der Stadt Kamiansky unter der Adresse: Prospect Svobody, 39 ein",  
      },
      main_image: "/images/events/post_most_reconnect.jpg",
      // photoGallery: [
      //   {
      //     src:  "/images/events/dsc0237.jpg",
      //     type: "image",
      //     description: "Назва картини"
      //   },
      // ],
    },
    {
      id: 5,
      uk: {
        title:"У Кам’янському презентували мистецький проєкт «POST MOST 6 Reconnect»",
        description:"19 жовтня у Музеї історії міста відбулася презентація проєкту «POST MOST 6 Reconnect», який об’єднав 16 українських художників із різних міст та країн.",
        content:"Ініціатива, започаткована у Маріуполі ще в 2019 році, продовжує жити та розвиватися, навіть попри складні часи. Цьогоріч виставка стала справжнім культурним мостом, що об’єднав митців з Маріуполя, Кам’янського, Кривого Рогу та Києва, а також їхніх колег із Німеччини та Австрії. Під час відкриття гості музею мали змогу не лише ознайомитися з мистецькими роботами, а й поспілкуватися з авторами через відеозв’язок. Атмосферу доповнювали кавер-версії відомих пісень, виконані музикантами.",
      },
      en: {
        title:"The artistic project «POST MOST 6 Reconnect» was presented in Kamianskyi",
        description:"On October 19, the Museum of the History of the City hosted the presentation of the «POST MOST 6 Reconnect» project, which united 16 Ukrainian artists from different cities and countries.",
        content:"The initiative, launched in Mariupol back in 2019, continues to live and develop, even in difficult times. This year, the exhibition became a real cultural bridge that united artists from Mariupol, Kamiansk, Kryvyi Rih and Kyiv, as well as their colleagues from Germany and Austria. During the opening, museum guests had the opportunity not only to familiarize themselves with the works of art, but also to communicate with the authors via video link. The atmosphere was complemented by cover versions of famous songs performed by musicians.",
      },
      de: {
        title:"Das künstlerische Projekt «POST MOST 6 Reconnect» wurde in Kamianskyi präsentiert",
        description:"Am 19. Oktober fand im Museum für Stadtgeschichte die Präsentation des Projekts «POST MOST 6 Reconnect» statt, bei dem 16 ukrainische Künstler aus verschiedenen Städten und Ländern zusammenkamen.",
        content:"Die bereits 2019 in Mariupol ins Leben gerufene Initiative lebt und entwickelt sich auch in schwierigen Zeiten weiter. In diesem Jahr wurde die Ausstellung zu einer echten kulturellen Brücke, die Künstler aus Mariupol, Kamjansk, Krywyj Rih und Kiew sowie ihre Kollegen aus Deutschland und Österreich vereinte. Während der Eröffnung hatten Museumsgäste nicht nur die Möglichkeit, sich mit den Kunstwerken vertraut zu machen, sondern auch per Videoschaltung mit den Autoren zu kommunizieren. Ergänzt wurde die Atmosphäre durch von Musikern vorgetragene Coverversionen berühmter Lieder.",
      },
      main_image: "/images/events/POST_MOST_6_Reconnect.jpg",
      photoGallery: [
        {
          src:  "/images/events/dsc0237.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0180.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0189.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0201.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0205.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0239.jpg",
          type: "image",
          description: "Назва картини"
        },
      ],
    },
    {
      id: 6,
      uk: {
        title:"Запрошуємо Вас на відкриття художньої виставки проєкту «ПОСТ МОСТ»",
        description:"Художній проєкт «ПОСТ МОСТ» був заснований у 2017 році у Маріуполі як щорічна резиденція та виставка художніх творів для митців з багатьох міст України та Європи",
        content:"Засновниками проєкту були члени громадської організації 'ARS ALTERA'. У 2023 році художники з Маріуполя, Кам'янського, Києва та Одеси були на екскурсії у цехах комбінату «КАМЕТ-СТАЛЬ», їх роботи були присвячені індустріальної складової міст України. Цього року до проєкту знов приєдналися постійні учасники громадської організації 'ARS ALTERA' з новими ідеями та наративами, тому проєкт отримав назву «POST MOST 6 Reconnect».\nНа виставці будуть представлені роботи сучасних тематик 16 художників, актуальні риси яких митці хочуть зараз донести глядачу.\nНа відкритті за допомогою відео зв’язку глядачі зможуть поспілкуватись з художниками проєкту, які знаходяться у різних містах та странах, а музиканти наживо подарують присутнім кавер-версії відомих пісень. Запрошуємо Вас на відкриття виставки 19 жовтня о 12:00 у Музей історії міста Кам’янського за адресою: проспект Свободи, 39",  
      },
      en: {
        title:"We invite you to the opening of the art exhibition of the «POST MOST» project",
        description:"The art project «POST MOST» was founded in 2017 in Mariupol as an annual residence and exhibition of works of art for artists from many cities of Ukraine and Europe",
        content:"The founders of the project were members of the public organization 'ARS ALTERA'. In 2023, artists from Mariupol, Kamiansk, Kyiv and Odesa went on a tour of the workshops of the «KAMET-STEEL» combine, their works were dedicated to the industrial component of the cities of Ukraine. This year permanent members of the public organization 'ARS ALTERA' joined the project again with new ideas and narratives, therefore the project was named «POST MOST 6 Reconnect». nAt the opening, the audience will be able to communicate with the artists of the project, who are in different cities and countries, via video link, and the musicians will present live cover versions of famous songs to the audience. We invite you to the opening of the exhibition on October 19 at 12:00 in the Museum of the History of the City Kamianskyi at the address: 39 Svoboda Avenue",  
      },
      de: {
        title:"Wir laden Sie zur Eröffnung der Kunstausstellung des Projekts «POST MOST» ein",
        description:"Das Kunstprojekt «POST MOST» wurde 2017 in Mariupol als jährliche Residenz und Ausstellung von Kunstwerken für Künstler aus vielen Städten der Ukraine und Europas gegründet",
        content:"Die Gründer des Projekts waren Mitglieder der öffentlichen Organisation „ARS ALTERA“. Im Jahr 2023 besuchten Künstler aus Mariupol, Kamjansk, Kiew und Odessa die Werkstätten des Kombinats „KAMET-STEEL“, deren Werke der industriellen Komponente der Städte der Ukraine gewidmet waren. In diesem Jahr beteiligten sich wieder reguläre Mitglieder der öffentlichen Organisation „ARS ALTERA“ mit neuen Ideen und Erzählungen am Projekt, weshalb das Projekt den Namen „POST MOST 6 Reconnect“ erhielt. Die Ausstellung präsentiert Werke von 16 Künstlern zu modernen Themen, deren aktuelle Aspekte die Künstler nun dem Publikum vermitteln wollen. Bei der Eröffnung kann das Publikum mit den in verschiedenen Städten und Ländern ansässigen Künstlern des Projekts kommunizieren und die Musiker werden dem Publikum per Videokommunikation Live-Coverversionen berühmter Songs präsentieren. Wir laden Sie zur Eröffnung der Ausstellung am 19. Oktober um 12:00 Uhr im Museum der Geschichte der Stadt Kamiansky unter der Adresse: Prospect Svobody, 39 ein",  
      },
      main_image: "/images/events/post_most_reconnect.jpg",
      // photoGallery: [
      //   {
      //     src:  "/images/events/dsc0237.jpg",
      //     type: "image",
      //     description: "Назва картини"
      //   },
      // ],
    },
    {
      id: 7,
      uk: {
        title:"У Кам’янському презентували мистецький проєкт «POST MOST 6 Reconnect»",
        description:"19 жовтня у Музеї історії міста відбулася презентація проєкту «POST MOST 6 Reconnect», який об’єднав 16 українських художників із різних міст та країн.",
        content:"Ініціатива, започаткована у Маріуполі ще в 2019 році, продовжує жити та розвиватися, навіть попри складні часи. Цьогоріч виставка стала справжнім культурним мостом, що об’єднав митців з Маріуполя, Кам’янського, Кривого Рогу та Києва, а також їхніх колег із Німеччини та Австрії. Під час відкриття гості музею мали змогу не лише ознайомитися з мистецькими роботами, а й поспілкуватися з авторами через відеозв’язок. Атмосферу доповнювали кавер-версії відомих пісень, виконані музикантами.",
      },
      en: {
        title:"The artistic project «POST MOST 6 Reconnect» was presented in Kamianskyi",
        description:"On October 19, the Museum of the History of the City hosted the presentation of the «POST MOST 6 Reconnect» project, which united 16 Ukrainian artists from different cities and countries.",
        content:"The initiative, launched in Mariupol back in 2019, continues to live and develop, even in difficult times. This year, the exhibition became a real cultural bridge that united artists from Mariupol, Kamiansk, Kryvyi Rih and Kyiv, as well as their colleagues from Germany and Austria. During the opening, museum guests had the opportunity not only to familiarize themselves with the works of art, but also to communicate with the authors via video link. The atmosphere was complemented by cover versions of famous songs performed by musicians.",
      },
      de: {
        title:"Das künstlerische Projekt «POST MOST 6 Reconnect» wurde in Kamianskyi präsentiert",
        description:"Am 19. Oktober fand im Museum für Stadtgeschichte die Präsentation des Projekts «POST MOST 6 Reconnect» statt, bei dem 16 ukrainische Künstler aus verschiedenen Städten und Ländern zusammenkamen.",
        content:"Die bereits 2019 in Mariupol ins Leben gerufene Initiative lebt und entwickelt sich auch in schwierigen Zeiten weiter. In diesem Jahr wurde die Ausstellung zu einer echten kulturellen Brücke, die Künstler aus Mariupol, Kamjansk, Krywyj Rih und Kiew sowie ihre Kollegen aus Deutschland und Österreich vereinte. Während der Eröffnung hatten Museumsgäste nicht nur die Möglichkeit, sich mit den Kunstwerken vertraut zu machen, sondern auch per Videoschaltung mit den Autoren zu kommunizieren. Ergänzt wurde die Atmosphäre durch von Musikern vorgetragene Coverversionen berühmter Lieder.",
      },
      main_image: "/images/events/POST_MOST_6_Reconnect.jpg",
      photoGallery: [
        {
          src:  "/images/events/dsc0237.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0180.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0189.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0201.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0205.jpg",
          type: "image",
          description: "Назва картини"
        },
        {
          src:  "/images/events/dsc0239.jpg",
          type: "image",
          description: "Назва картини"
        },
      ],
    },
    {
      id: 8,
      uk: {
        title:"Запрошуємо Вас на відкриття художньої виставки проєкту «ПОСТ МОСТ»",
        description:"Художній проєкт «ПОСТ МОСТ» був заснований у 2017 році у Маріуполі як щорічна резиденція та виставка художніх творів для митців з багатьох міст України та Європи",
        content:"Засновниками проєкту були члени громадської організації 'ARS ALTERA'. У 2023 році художники з Маріуполя, Кам'янського, Києва та Одеси були на екскурсії у цехах комбінату «КАМЕТ-СТАЛЬ», їх роботи були присвячені індустріальної складової міст України. Цього року до проєкту знов приєдналися постійні учасники громадської організації 'ARS ALTERA' з новими ідеями та наративами, тому проєкт отримав назву «POST MOST 6 Reconnect».\nНа виставці будуть представлені роботи сучасних тематик 16 художників, актуальні риси яких митці хочуть зараз донести глядачу.\nНа відкритті за допомогою відео зв’язку глядачі зможуть поспілкуватись з художниками проєкту, які знаходяться у різних містах та странах, а музиканти наживо подарують присутнім кавер-версії відомих пісень. Запрошуємо Вас на відкриття виставки 19 жовтня о 12:00 у Музей історії міста Кам’янського за адресою: проспект Свободи, 39",  
      },
      en: {
        title:"We invite you to the opening of the art exhibition of the «POST MOST» project",
        description:"The art project «POST MOST» was founded in 2017 in Mariupol as an annual residence and exhibition of works of art for artists from many cities of Ukraine and Europe",
        content:"The founders of the project were members of the public organization 'ARS ALTERA'. In 2023, artists from Mariupol, Kamiansk, Kyiv and Odesa went on a tour of the workshops of the «KAMET-STEEL» combine, their works were dedicated to the industrial component of the cities of Ukraine. This year permanent members of the public organization 'ARS ALTERA' joined the project again with new ideas and narratives, therefore the project was named «POST MOST 6 Reconnect». nAt the opening, the audience will be able to communicate with the artists of the project, who are in different cities and countries, via video link, and the musicians will present live cover versions of famous songs to the audience. We invite you to the opening of the exhibition on October 19 at 12:00 in the Museum of the History of the City Kamianskyi at the address: 39 Svoboda Avenue",  
      },
      de: {
        title:"Wir laden Sie zur Eröffnung der Kunstausstellung des Projekts «POST MOST» ein",
        description:"Das Kunstprojekt «POST MOST» wurde 2017 in Mariupol als jährliche Residenz und Ausstellung von Kunstwerken für Künstler aus vielen Städten der Ukraine und Europas gegründet",
        content:"Die Gründer des Projekts waren Mitglieder der öffentlichen Organisation „ARS ALTERA“. Im Jahr 2023 besuchten Künstler aus Mariupol, Kamjansk, Kiew und Odessa die Werkstätten des Kombinats „KAMET-STEEL“, deren Werke der industriellen Komponente der Städte der Ukraine gewidmet waren. In diesem Jahr beteiligten sich wieder reguläre Mitglieder der öffentlichen Organisation „ARS ALTERA“ mit neuen Ideen und Erzählungen am Projekt, weshalb das Projekt den Namen „POST MOST 6 Reconnect“ erhielt. Die Ausstellung präsentiert Werke von 16 Künstlern zu modernen Themen, deren aktuelle Aspekte die Künstler nun dem Publikum vermitteln wollen. Bei der Eröffnung kann das Publikum mit den in verschiedenen Städten und Ländern ansässigen Künstlern des Projekts kommunizieren und die Musiker werden dem Publikum per Videokommunikation Live-Coverversionen berühmter Songs präsentieren. Wir laden Sie zur Eröffnung der Ausstellung am 19. Oktober um 12:00 Uhr im Museum der Geschichte der Stadt Kamiansky unter der Adresse: Prospect Svobody, 39 ein",  
      },
      main_image: "/images/events/post_most_reconnect.jpg",
      // photoGallery: [
      //   {
      //     src:  "/images/events/dsc0237.jpg",
      //     type: "image",
      //     description: "Назва картини"
      //   },
      // ],
    },
  ];
  return events;
}
