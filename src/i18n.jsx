import { createContext, useContext, useEffect, useState } from 'react';

/* ============================================================
   Локализация: RU (по умолчанию), KZ, EN.
   Весь переводимый контент лежит здесь. Структурные вещи
   (иконки, цифры, координаты, телефон) одинаковы во всех
   языках и просто повторяются для простоты доступа.
   ============================================================ */

export const LANGS = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' },
];

const ru = {
  nav: [
    { id: 'map', label: 'География' },
    { id: 'journey', label: 'Как это работает' },
    { id: 'about', label: 'О компании' },
    { id: 'features', label: 'Услуги' },
    { id: 'history', label: 'История' },
    { id: 'news', label: 'Новости' },
    { id: 'advantages', label: 'Преимущества' },
    { id: 'contact', label: 'Контакты' },
  ],
  ui: {
    contact: 'Связаться',
    getQuote: 'Получить КП',
    aboutCompany: 'О компании',
    readMore: 'Читать далее',
    allNews: 'Все новости',
    portal: 'Портал eQamqorlyq',
    send: 'Отправить',
    name: 'Имя',
    phone: 'Номер телефона',
    message: 'Сообщение',
    namePh: 'Как к вам обращаться?',
    phonePh: '+7 (___) ___-__-__',
    msgPh: 'Расскажите о вашем учреждении и задаче',
    thanks: '✓ Спасибо! Мы свяжемся с вами в ближайшее время.',
    lightTheme: 'Включить светлую тему',
    darkTheme: 'Включить тёмную тему',
    lang: 'Язык',
  },
  cosmos: {
    eyebrow: 'Организация питания · 8 лет на рынке',
    h1: ['Лечебно-диетическое', 'питание', 'нового уровня'],
    lead: (n, c) =>
      `${n} объектов в ${c} городах Казахстана — больницы, школы, центры социального обслуживания, воинские части и рудники. Ежедневно кормим более 6 000 человек.`,
    badges: [
      { n: '8+', l: 'лет опыта' },
      { n: '200+', l: 'специалистов' },
      { n: '17 млн', l: 'порций' },
    ],
    hint: 'Листайте — покажем на карте ↓',
    mapEyebrow: 'География присутствия',
    mapH3: ['объектов по', 'Казахстану'],
    legendCity: 'Город присутствия',
    legendMulti: 'Несколько объектов',
    legendHint: 'Наведите на точку',
    obj1: 'объект',
    obj2: 'объекта',
  },
  astana: {
    city: 'АСТАНА',
    sub: 'Городская больница №1 · 12:30',
    servedEyebrow: 'Астана · обед подан',
    title: ['Вот ради чего', 'вся цепочка'],
    cards: [
      { t: 'Стейк, 220 г', s: 'прожарка под контролем' },
      { t: '+75 °C в центре', s: 'фиксация в eQamqorlyq' },
      { t: 'От кухни до стола — 12 мин', s: 'подача точно по графику' },
      { t: 'Рацион по мед. нормам', s: 'лечебные столы 1–15' },
    ],
    final: ['И так —', 'каждый день'],
    stats: [
      { l: 'порций ежедневно' },
      { l: 'объектов' },
      { l: 'городов' },
    ],
  },
  journey: {
    eyebrow: 'Путь тарелки — в обратную сторону',
    head: ['От тарелки —', 'к заявке'],
    intro:
      'Пять шагов, которые проходит каждая порция. Листайте — каждый процесс разворачивается прямо на глазах.',
    stages: [
      {
        time: '12:30',
        step: 'Результат',
        title: 'Стол накрыт',
        text: 'Горячий обед на столе — сбалансированный, по медицинским нормам, точно вовремя. Именно этот момент видит пациент. А теперь отмотаем назад: что было до него?',
        meta: ['6 000+ порций в день', 'Лечебные столы 1–15'],
      },
      {
        time: '09:40',
        step: 'Приготовление',
        title: 'Кухня в работе',
        text: 'Повара готовят по технологическим картам. Температура в центре блюда, время закладки, вес порции — всё фиксируется и уходит в eQamqorlyq.',
        meta: ['Контроль +75 °C и выше', 'Техкарта на каждое блюдо'],
      },
      {
        time: '07:15',
        step: 'Обработка',
        title: 'Очистка и подготовка',
        text: 'Мойка, очистка, нарезка. Санитарные зоны разделены, инвентарь маркирован по цветам, каждый этап проходит контроль ХАССП.',
        meta: ['Раздельные зоны', 'Маркированный инвентарь'],
      },
      {
        time: '05:00',
        step: 'Логистика',
        title: 'Завозка продуктов',
        text: 'Проверенные поставщики, непрерывная холодовая цепь, приёмка по накладным. Продукт не попадёт на кухню без документов и проверки качества.',
        meta: ['Холодовая цепь −18 °C', 'Приёмка по накладным'],
      },
      {
        time: 'Вчера',
        step: 'Старт',
        title: 'Заявка и заказ',
        text: 'Всё начинается здесь: учреждение оставляет заявку, диетолог формирует меню на день, система рассчитывает объёмы закупки.',
        meta: ['Меню от диетолога', 'Автоматический расчёт'],
      },
    ],
  },
  features: {
    eyebrow: 'Что мы делаем',
    head: ['Полный цикл', 'организации питания'],
    lead: 'От закупки продуктов до цифрового контроля качества на тарелке пациента — мы отвечаем за каждый этап.',
    items: [
      { icon: '🛡️', title: 'Контроль качества', text: 'Проверяем продукты, соблюдаем санитарные нормы и контролируем каждый этап приготовления.' },
      { icon: '🥗', title: 'Сбалансированное питание', text: 'Формируем рационы с учётом медицинских требований, делая питание не только полезным, но и вкусным.' },
      { icon: '🏅', title: 'Опыт и профессионализм', text: 'Работаем более 8 лет, в команде более 200 специалистов, знающих своё дело.' },
      { icon: '🎯', title: 'Индивидуальный подход', text: 'Адаптируем меню под нужды клиентов, учитываем особенности учреждений и их требования.' },
      { icon: '⚙️', title: 'Технологии и автоматизация', text: 'Внедряем цифровые решения для контроля качества, учёта и логистики, обеспечивая стабильность сервиса.' },
      { icon: '🔒', title: 'Надёжность и стабильность', text: 'Гарантируем бесперебойные поставки, точное выполнение заказов и высокий уровень сервиса.' },
    ],
  },
  stats: {
    head: ['OpenSoulInc', 'в цифрах'],
    items: [
      { value: 40, suffix: '+', label: 'Реализованных проектов' },
      { value: 200, suffix: '+', label: 'Квалифицированных сотрудников' },
      { value: 17, suffix: ' млн', label: 'Приготовлено порций еды' },
      { value: 6000, suffix: '+', label: 'Человек получают услугу ежедневно' },
    ],
  },
  about: {
    eyebrow: 'О компании',
    head: ['Почему', 'выбирают нас?'],
    p1: 'Мы стремимся шагать в ногу со временем, внедряя современные технологии в сферу лечебно-диетического и общественного питания. Автоматизация процессов и цифровые решения для контроля качества и логистики позволяют работать эффективнее.',
    p2: 'Контроль качества на каждом этапе, современные технологии приготовления и профессиональная команда позволяют обеспечивать вкусное, безопасное и полезное питание. Нам доверяют учреждения в 5 регионах Казахстана.',
    cards: [
      { i: '🏥', t: 'Больницы', s: 'Лечебные столы 1–15' },
      { i: '🎓', t: 'Школы', s: 'Горячее питание' },
      { i: '🏭', t: 'Предприятия', s: 'Корпоративное меню' },
      { i: '🎪', t: 'Кейтеринг', s: 'События любого масштаба' },
    ],
  },
  timeline: {
    eyebrow: 'Путь',
    head: ['Развитие', 'OpenSoulInc'],
    items: [
      { year: '2016', title: 'Основание компании', text: 'Обеспечение бесперебойным питанием при возведении многофункционального комплекса «Abu Dhabi» в Астане.' },
      { year: '2017', title: 'Выход на рынок', text: 'Организация питания для зимних международных соревнований «Зимняя Универсиада-2017» в городе Алматы.' },
      { year: '2018', title: 'Расширение', text: 'Расширение сферы деятельности посредством услуг кейтеринга. Открытие 8 филиалов в Республике Казахстан.' },
      { year: '2019+', title: 'Цифровизация', text: 'Разработка и внедрение цифрового комплекса «eQamqorlyq» для взаимодействия с пациентами в рамках контроля качества.' },
    ],
  },
  trust: {
    eyebrow: 'Нам доверяют',
    clients: [
      { icon: '🏥', name: 'ГБ №1, Астана' },
      { icon: '👶', name: 'ГДБ №1, Астана' },
      { icon: '🎓', name: 'Школы Алматы' },
      { icon: '🏛️', name: 'Национальный госпиталь МЦ УДП РК' },
      { icon: '🎿', name: 'Универсиада-2017' },
      { icon: '🍽️', name: 'ТОО «Restaurant Business»' },
      { icon: '🛡️', name: 'Военные части РК' },
      { icon: '🏗️', name: 'МФК «Abu Dhabi»' },
    ],
  },
  news: {
    eyebrow: 'Новости',
    head: ['Что', 'происходит'],
    lead: 'Проекты, внедрения и события компании — коротко о главном.',
    items: [
      { emoji: '🍲', tag: 'Новости', date: '24 Дек 2025', title: 'По-домашнему: горячее питание для солдат', text: 'В борьбе с паводком важно участие каждого. Пока военнослужащие и оперативные службы задействованы в ликвидации стихии, мы обеспечиваем их горячей провизией.' },
      { emoji: '📱', tag: 'Технологии', date: '01 Окт 2024', title: 'Внедрена система eQamqorlyq', text: 'В 8 объектах внедрена инновационная система eQamqorlyq для улучшения качества обслуживания и поддержки здоровья клиентов.' },
      { emoji: '🔬', tag: 'Проекты', date: '24 Дек 2025', title: 'Пилотный проект ХАССП в Национальном госпитале', text: 'В Национальном госпитале МЦ УДП РК запущен пилотный проект по внедрению комплекса e-Qamqorlyq — электронной системы ХАССП.' },
      { emoji: '🍱', tag: 'Новости', date: '28 Фев 2023', title: 'Введена система ланч-боксов', text: 'В этом учебном году в Алматы почти на 40% увеличился охват школьников бесплатным питанием — сейчас его получают около 133 тысяч детей.' },
      { emoji: '🤝', tag: 'События', date: '16 Апр 2025', title: 'Деловой визит и профессиональный обмен', text: 'Поездка в Екатеринбург: обмен опытом с международными специалистами в сфере организации лечебно-диетического питания.' },
      { emoji: '🎒', tag: 'СМИ', date: '28 Фев 2023', title: 'Что едят школьники Алматы?', text: 'Бесплатное горячее питание в металлических ланч-боксах организовали в четырёх школах Алматы. Пилотный проект запустили за счёт местного бюджета.' },
    ],
  },
  advantages: {
    eyebrow: 'Наши преимущества',
    head: ['Опыт плюс', 'технологии'],
    lead: 'Автоматизация процессов, цифровой контроль качества и строгие стандарты безопасности позволяют гарантировать стабильность и надёжность сервиса.',
    skills: [
      { name: 'Качество продуктов', value: 95 },
      { name: 'Качество сервиса', value: 87 },
      { name: 'Модернизация', value: 85 },
      { name: 'Цифровизация', value: 82 },
    ],
    qrTitle: 'eQamqorlyq.kz',
    qrText:
      'Инновационная система управления качеством обслуживания в заведениях общественного питания, школах и больницах. Каждый день публикуется меню с блюдами — доступ по QR-коду, оценка качества прозрачна и мгновенна.',
  },
  testimonials: {
    eyebrow: 'Отзывы',
    head: ['Что о нас', 'говорят?'],
    items: [
      { text: 'Работаем с OpenSoulInc уже несколько лет, и за это время ни разу не столкнулись с проблемами в организации питания. Меню разнообразное, блюда всегда свежие, а персонал внимательный. Наши пациенты довольны, а для нас это главное!', name: 'Алина К.', role: 'Главный врач, ГБ №1 г. Астана', initials: 'АК' },
      { text: 'Очень довольны работой OpenSoulInc! Блюда всегда свежие, вкусные и соответствуют диетическим требованиям. Пациенты положительно отзываются о питании, а персоналу приятно работать с такой ответственной компанией.', name: 'Наталья М.', role: 'Старшая медсестра, ГДБ №1 г. Астана', initials: 'НМ' },
      { text: 'Выбирая поставщика питания, мы искали компанию, которая не просто выполняет обязательства, а стремится к развитию и инновациям. OpenSoulInc внедряет автоматизацию, что делает процесс работы прозрачным.', name: 'Андрей П.', role: 'Директор, ТОО «Restaurant Business»', initials: 'АП' },
      { text: 'Как специалист, я обращаю особое внимание на сбалансированность рациона. OpenSoulInc отлично справляется с этой задачей — питание соответствует всем нормам, при этом остаётся вкусным и полезным.', name: 'Марина Т.', role: 'Диетолог, ТОО «Marketing Kz»', initials: 'МТ' },
    ],
  },
  contact: {
    ctaTitle: ['Готовы обсудить', 'ваш проект?'],
    ctaLead: 'Оставьте заявку — рассчитаем стоимость и подготовим коммерческое предложение под ваше учреждение.',
    eyebrow: 'Контакты',
    head: ['Связаться', 'с нами'],
    office: 'Головной офис',
    city: 'Астана, Казахстан',
    formTitle: 'Оставить заявку',
    info: [
      { icon: '📞', key: 'Телефон', value: '+7 747 34 32 342', href: 'tel:+77473432342' },
      { icon: '✉️', key: 'Почта', value: 'info@opensoulinc.kz', href: 'mailto:info@opensoulinc.kz' },
      { icon: '📍', key: 'Адрес', value: 'ул. Керей, Жанибек хандар, д. 5, офис 33' },
      { icon: '🕗', key: 'Часы работы', value: 'Пн–Пт: 8:00 — 18:00' },
    ],
  },
  footer: {
    tagline: 'Предоставление услуг лечебно-диетического и общественного питания в больницах, школах и учреждениях Казахстана.',
    companyH: 'Компания',
    company: [
      { label: 'О нас', href: '#about' },
      { label: 'Услуги', href: '#features' },
      { label: 'Новости', href: '#news' },
      { label: 'Контакты', href: '#contact' },
    ],
    infoH: 'Информация',
    info: [
      { label: 'Поставщикам', href: '#contact' },
      { label: 'Вакансии', href: '#contact' },
      { label: 'Политика конфиденциальности', href: '#contact' },
      { label: 'eQamqorlyq.kz', href: 'https://eqamqorlyq.kz', ext: true },
    ],
    rights: 'OpenSoulInc — организация питания',
  },
};

const kz = {
  nav: [
    { id: 'map', label: 'География' },
    { id: 'journey', label: 'Қалай жұмыс істейді' },
    { id: 'about', label: 'Компания туралы' },
    { id: 'features', label: 'Қызметтер' },
    { id: 'history', label: 'Тарих' },
    { id: 'news', label: 'Жаңалықтар' },
    { id: 'advantages', label: 'Артықшылықтар' },
    { id: 'contact', label: 'Байланыс' },
  ],
  ui: {
    contact: 'Байланысу',
    getQuote: 'КҰ алу',
    aboutCompany: 'Компания туралы',
    readMore: 'Толығырақ',
    allNews: 'Барлық жаңалықтар',
    portal: 'eQamqorlyq порталы',
    send: 'Жіберу',
    name: 'Аты',
    phone: 'Телефон нөмірі',
    message: 'Хабарлама',
    namePh: 'Сізге қалай жүгінейік?',
    phonePh: '+7 (___) ___-__-__',
    msgPh: 'Мекемеңіз бен міндетіңіз туралы айтыңыз',
    thanks: '✓ Рақмет! Жақын арада сізбен байланысамыз.',
    lightTheme: 'Ашық тақырыпты қосу',
    darkTheme: 'Күңгірт тақырыпты қосу',
    lang: 'Тіл',
  },
  cosmos: {
    eyebrow: 'Тамақтануды ұйымдастыру · нарықта 8 жыл',
    h1: ['Емдік-диеталық', 'тамақтану —', 'жаңа деңгейде'],
    lead: (n, c) =>
      `Қазақстанның ${c} қаласындағы ${n} нысан — ауруханалар, мектептер, әлеуметтік қызмет орталықтары, әскери бөлімдер мен кеніштер. Күн сайын 6 000-нан астам адамды тамақтандырамыз.`,
    badges: [
      { n: '8+', l: 'жыл тәжірибе' },
      { n: '200+', l: 'маман' },
      { n: '17 млн', l: 'порция' },
    ],
    hint: 'Төмен айналдырыңыз — картадан көрсетеміз ↓',
    mapEyebrow: 'Қатысу географиясы',
    mapH3: ['нысан бойынша', 'Қазақстан'],
    legendCity: 'Қатысу қаласы',
    legendMulti: 'Бірнеше нысан',
    legendHint: 'Нүктеге меңзеңіз',
    obj1: 'нысан',
    obj2: 'нысан',
  },
  astana: {
    city: 'АСТАНА',
    sub: 'Қалалық аурухана №1 · 12:30',
    servedEyebrow: 'Астана · түскі ас берілді',
    title: ['Осының бәрі —', 'осы сәт үшін'],
    cards: [
      { t: 'Стейк, 220 г', s: 'қуыру бақылауда' },
      { t: 'Ортасында +75 °C', s: 'eQamqorlyq-та тіркеледі' },
      { t: 'Асханадан үстелге — 12 мин', s: 'кестеге дәл сәйкес' },
      { t: 'Мед. нормаға сай рацион', s: 'емдік үстелдер 1–15' },
    ],
    final: ['Осылай —', 'күн сайын'],
    stats: [
      { l: 'порция күніне' },
      { l: 'нысан' },
      { l: 'қала' },
    ],
  },
  journey: {
    eyebrow: 'Тәрелке жолы — кері бағытта',
    head: ['Тәрелкеден —', 'өтінімге дейін'],
    intro:
      'Әрбір порция өтетін бес қадам. Айналдырыңыз — әр процесс көз алдыңызда ашылады.',
    stages: [
      {
        time: '12:30',
        step: 'Нәтиже',
        title: 'Үстел жайылды',
        text: 'Ыстық түскі ас үстелде — теңгерімді, медициналық нормаларға сай, дәл уақытында. Дәл осы сәтті пациент көреді. Ал енді артқа қайтарайық: оған дейін не болды?',
        meta: ['Күніне 6 000+ порция', 'Емдік үстелдер 1–15'],
      },
      {
        time: '09:40',
        step: 'Дайындау',
        title: 'Ас үй жұмыста',
        text: 'Аспазшылар технологиялық карталар бойынша дайындайды. Тағамның ортасындағы температура, салу уақыты, порция салмағы — бәрі тіркеліп, eQamqorlyq-қа түседі.',
        meta: ['+75 °C және жоғары бақылау', 'Әр тағамға техкарта'],
      },
      {
        time: '07:15',
        step: 'Өңдеу',
        title: 'Тазалау және дайындау',
        text: 'Жуу, тазалау, турау. Санитарлық аймақтар бөлінген, құрал-жабдық түспен таңбаланған, әр кезең ХАССП бақылауынан өтеді.',
        meta: ['Бөлек аймақтар', 'Таңбаланған құрал'],
      },
      {
        time: '05:00',
        step: 'Логистика',
        title: 'Өнім жеткізу',
        text: 'Тексерілген жеткізушілер, үздіксіз суық тізбек, жүкқұжат бойынша қабылдау. Өнім құжатсыз және сапа тексерусіз ас үйге түспейді.',
        meta: ['Суық тізбек −18 °C', 'Жүкқұжат бойынша қабылдау'],
      },
      {
        time: 'Кеше',
        step: 'Бастау',
        title: 'Өтінім және тапсырыс',
        text: 'Бәрі осыдан басталады: мекеме өтінім қалдырады, диетолог күндік мәзірді қалыптастырады, жүйе сатып алу көлемін есептейді.',
        meta: ['Диетолог мәзірі', 'Автоматты есептеу'],
      },
    ],
  },
  features: {
    eyebrow: 'Біз не істейміз',
    head: ['Тамақтануды ұйымдастырудың', 'толық циклі'],
    lead: 'Өнімді сатып алудан бастап пациент тәрелкесіндегі цифрлық сапа бақылауына дейін — әр кезеңге жауаптымыз.',
    items: [
      { icon: '🛡️', title: 'Сапа бақылауы', text: 'Өнімдерді тексереміз, санитарлық нормаларды сақтаймыз және дайындаудың әр кезеңін бақылаймыз.' },
      { icon: '🥗', title: 'Теңгерімді тамақтану', text: 'Медициналық талаптарды ескере отырып рацион құрамыз, тамақты пайдалы әрі дәмді етеміз.' },
      { icon: '🏅', title: 'Тәжірибе мен кәсібилік', text: '8 жылдан астам жұмыс істейміз, командада ісін білетін 200-ден астам маман бар.' },
      { icon: '🎯', title: 'Жеке көзқарас', text: 'Мәзірді клиент қажеттіліктеріне бейімдейміз, мекеме ерекшеліктерін ескереміз.' },
      { icon: '⚙️', title: 'Технология мен автоматтандыру', text: 'Сапа, есеп және логистика бақылауы үшін цифрлық шешімдерді енгіземіз.' },
      { icon: '🔒', title: 'Сенімділік пен тұрақтылық', text: 'Үздіксіз жеткізу, тапсырысты дәл орындау және жоғары деңгейлі қызметке кепілдік береміз.' },
    ],
  },
  stats: {
    head: ['OpenSoulInc', 'сандармен'],
    items: [
      { value: 40, suffix: '+', label: 'Жүзеге асқан жоба' },
      { value: 200, suffix: '+', label: 'Білікті қызметкер' },
      { value: 17, suffix: ' млн', label: 'Дайындалған порция' },
      { value: 6000, suffix: '+', label: 'Күн сайын қызмет алатын адам' },
    ],
  },
  about: {
    eyebrow: 'Компания туралы',
    head: ['Неге бізді', 'таңдайды?'],
    p1: 'Біз заманмен бірге жүруге ұмтыламыз, емдік-диеталық және қоғамдық тамақтану саласына заманауи технологияларды енгіземіз. Процестерді автоматтандыру мен цифрлық шешімдер тиімдірек жұмыс істеуге мүмкіндік береді.',
    p2: 'Әр кезеңдегі сапа бақылауы, заманауи дайындау технологиялары мен кәсіби команда дәмді, қауіпсіз әрі пайдалы тамақ беруге мүмкіндік береді. Бізге Қазақстанның 5 өңіріндегі мекемелер сенеді.',
    cards: [
      { i: '🏥', t: 'Ауруханалар', s: 'Емдік үстелдер 1–15' },
      { i: '🎓', t: 'Мектептер', s: 'Ыстық тамақ' },
      { i: '🏭', t: 'Кәсіпорындар', s: 'Корпоративтік мәзір' },
      { i: '🎪', t: 'Кейтеринг', s: 'Кез келген ауқымдағы іс-шара' },
    ],
  },
  timeline: {
    eyebrow: 'Жол',
    head: ['OpenSoulInc', 'дамуы'],
    items: [
      { year: '2016', title: 'Компанияның құрылуы', text: 'Астанадағы «Abu Dhabi» көпфункционалды кешенін салу кезінде үздіксіз тамақпен қамтамасыз ету.' },
      { year: '2017', title: 'Нарыққа шығу', text: 'Алматы қаласындағы «Қысқы Универсиада-2017» халықаралық жарысында тамақтануды ұйымдастыру.' },
      { year: '2018', title: 'Кеңею', text: 'Кейтеринг қызметтері арқылы қызмет аясын кеңейту. Қазақстанда 8 филиал ашу.' },
      { year: '2019+', title: 'Цифрландыру', text: 'Пациенттермен өзара әрекеттесу үшін «eQamqorlyq» цифрлық кешенін әзірлеу және енгізу.' },
    ],
  },
  trust: {
    eyebrow: 'Бізге сенеді',
    clients: [
      { icon: '🏥', name: 'ҚА №1, Астана' },
      { icon: '👶', name: 'ҚБА №1, Астана' },
      { icon: '🎓', name: 'Алматы мектептері' },
      { icon: '🏛️', name: 'ҚР ПІБ МО Ұлттық госпиталі' },
      { icon: '🎿', name: 'Универсиада-2017' },
      { icon: '🍽️', name: '«Restaurant Business» ЖШС' },
      { icon: '🛡️', name: 'ҚР әскери бөлімдері' },
      { icon: '🏗️', name: '«Abu Dhabi» КФК' },
    ],
  },
  news: {
    eyebrow: 'Жаңалықтар',
    head: ['Не', 'болып жатыр'],
    lead: 'Компанияның жобалары, енгізулері мен оқиғалары — ең бастысы туралы қысқаша.',
    items: [
      { emoji: '🍲', tag: 'Жаңалықтар', date: '24 Жел 2025', title: 'Үй жылуымен: сарбаздарға ыстық тамақ', text: 'Су тасқынымен күресте әркімнің қатысуы маңызды. Әскерилер апатты жоюда жүргенде, біз оларды ыстық азықпен қамтамасыз етеміз.' },
      { emoji: '📱', tag: 'Технологиялар', date: '01 Қаз 2024', title: 'eQamqorlyq жүйесі енгізілді', text: 'Қызмет сапасын арттыру үшін 8 нысанда инновациялық eQamqorlyq жүйесі енгізілді.' },
      { emoji: '🔬', tag: 'Жобалар', date: '24 Жел 2025', title: 'Ұлттық госпитальдегі ХАССП пилоты', text: 'ҚР ПІБ МО Ұлттық госпиталінде электрондық ХАССП жүйесі — e-Qamqorlyq кешенін енгізу бойынша пилоттық жоба басталды.' },
      { emoji: '🍱', tag: 'Жаңалықтар', date: '28 Ақп 2023', title: 'Ланч-бокс жүйесі енгізілді', text: 'Осы оқу жылында Алматыда оқушыларды тегін тамақпен қамту 40%-ға дерлік өсті — қазір оны 133 мыңға жуық бала алады.' },
      { emoji: '🤝', tag: 'Оқиғалар', date: '16 Сәу 2025', title: 'Іскерлік сапар және кәсіби алмасу', text: 'Екатеринбургке сапар: емдік-диеталық тамақтану саласындағы халықаралық мамандармен тәжірибе алмасу.' },
      { emoji: '🎒', tag: 'БАҚ', date: '28 Ақп 2023', title: 'Алматы оқушылары не жейді?', text: 'Алматының төрт мектебінде металл ланч-бокстарда тегін ыстық тамақ ұйымдастырылды. Пилоттық жоба жергілікті бюджет есебінен басталды.' },
    ],
  },
  advantages: {
    eyebrow: 'Біздің артықшылықтар',
    head: ['Тәжірибе плюс', 'технологиялар'],
    lead: 'Процестерді автоматтандыру, цифрлық сапа бақылауы және қатаң қауіпсіздік стандарттары қызметтің тұрақтылығы мен сенімділігіне кепілдік береді.',
    skills: [
      { name: 'Өнім сапасы', value: 95 },
      { name: 'Қызмет сапасы', value: 87 },
      { name: 'Жаңғырту', value: 85 },
      { name: 'Цифрландыру', value: 82 },
    ],
    qrTitle: 'eQamqorlyq.kz',
    qrText:
      'Қоғамдық тамақтану орындарында, мектептер мен ауруханаларда қызмет сапасын басқарудың инновациялық жүйесі. Күн сайын тағамдар мәзірі жарияланады — QR-код арқылы қолжетімді, сапаны бағалау ашық әрі жедел.',
  },
  testimonials: {
    eyebrow: 'Пікірлер',
    head: ['Біз туралы', 'не дейді?'],
    items: [
      { text: 'OpenSoulInc-пен бірнеше жыл жұмыс істеп келеміз, осы уақыт ішінде тамақтануды ұйымдастыруда бірде-бір мәселеге тап болған жоқпыз. Мәзір алуан түрлі, тағамдар әрдайым жаңа, персонал ұқыпты. Пациенттеріміз риза!', name: 'Алина Қ.', role: 'Бас дәрігер, ҚА №1 Астана', initials: 'АҚ' },
      { text: 'OpenSoulInc жұмысына өте риза! Тағамдар әрдайым жаңа, дәмді әрі диеталық талаптарға сай. Пациенттер тамақ туралы жақсы пікір айтады.', name: 'Наталья М.', role: 'Аға мейіргер, ҚБА №1 Астана', initials: 'НМ' },
      { text: 'Тамақ жеткізушіні таңдағанда біз тек міндеттемені орындап қана қоймай, дамуға ұмтылатын компанияны іздедік. OpenSoulInc автоматтандыруды енгізіп, процесті ашық етеді.', name: 'Андрей П.', role: 'Директор, «Restaurant Business» ЖШС', initials: 'АП' },
      { text: 'Маман ретінде рационның теңгерімділігіне ерекше көңіл бөлемін. OpenSoulInc бұл міндетті тамаша орындайды — тамақ барлық нормаға сай, әрі дәмді.', name: 'Марина Т.', role: 'Диетолог, «Marketing Kz» ЖШС', initials: 'МТ' },
    ],
  },
  contact: {
    ctaTitle: ['Жобаңызды', 'талқылауға дайынсыз ба?'],
    ctaLead: 'Өтінім қалдырыңыз — құнын есептеп, мекемеңізге арналған коммерциялық ұсыныс дайындаймыз.',
    eyebrow: 'Байланыс',
    head: ['Бізбен', 'байланысу'],
    office: 'Бас кеңсе',
    city: 'Астана, Қазақстан',
    formTitle: 'Өтінім қалдыру',
    info: [
      { icon: '📞', key: 'Телефон', value: '+7 747 34 32 342', href: 'tel:+77473432342' },
      { icon: '✉️', key: 'Пошта', value: 'info@opensoulinc.kz', href: 'mailto:info@opensoulinc.kz' },
      { icon: '📍', key: 'Мекенжай', value: 'Керей, Жәнібек хандар к-сі, 5-үй, 33-кеңсе' },
      { icon: '🕗', key: 'Жұмыс уақыты', value: 'Дс–Жм: 8:00 — 18:00' },
    ],
  },
  footer: {
    tagline: 'Қазақстанның ауруханалары, мектептері мен мекемелерінде емдік-диеталық және қоғамдық тамақтану қызметтерін ұсыну.',
    companyH: 'Компания',
    company: [
      { label: 'Біз туралы', href: '#about' },
      { label: 'Қызметтер', href: '#features' },
      { label: 'Жаңалықтар', href: '#news' },
      { label: 'Байланыс', href: '#contact' },
    ],
    infoH: 'Ақпарат',
    info: [
      { label: 'Жеткізушілерге', href: '#contact' },
      { label: 'Бос орындар', href: '#contact' },
      { label: 'Құпиялылық саясаты', href: '#contact' },
      { label: 'eQamqorlyq.kz', href: 'https://eqamqorlyq.kz', ext: true },
    ],
    rights: 'OpenSoulInc — тамақтануды ұйымдастыру',
  },
};

const en = {
  nav: [
    { id: 'map', label: 'Coverage' },
    { id: 'journey', label: 'How it works' },
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Services' },
    { id: 'history', label: 'History' },
    { id: 'news', label: 'News' },
    { id: 'advantages', label: 'Advantages' },
    { id: 'contact', label: 'Contact' },
  ],
  ui: {
    contact: 'Contact us',
    getQuote: 'Get a quote',
    aboutCompany: 'About us',
    readMore: 'Read more',
    allNews: 'All news',
    portal: 'eQamqorlyq portal',
    send: 'Send',
    name: 'Name',
    phone: 'Phone number',
    message: 'Message',
    namePh: 'How should we address you?',
    phonePh: '+7 (___) ___-__-__',
    msgPh: 'Tell us about your facility and needs',
    thanks: '✓ Thank you! We will contact you shortly.',
    lightTheme: 'Switch to light theme',
    darkTheme: 'Switch to dark theme',
    lang: 'Language',
  },
  cosmos: {
    eyebrow: 'Catering services · 8 years on the market',
    h1: ['Therapeutic & dietary', 'catering —', 'a new level'],
    lead: (n, c) =>
      `${n} facilities across ${c} cities of Kazakhstan — hospitals, schools, social service centers, military units and mines. Every day we feed over 6,000 people.`,
    badges: [
      { n: '8+', l: 'years of experience' },
      { n: '200+', l: 'specialists' },
      { n: '17M', l: 'portions' },
    ],
    hint: 'Scroll — see it on the map ↓',
    mapEyebrow: 'Geography of presence',
    mapH3: ['facilities across', 'Kazakhstan'],
    legendCity: 'City of presence',
    legendMulti: 'Multiple facilities',
    legendHint: 'Hover over a point',
    obj1: 'facility',
    obj2: 'facilities',
  },
  astana: {
    city: 'ASTANA',
    sub: 'City Hospital No. 1 · 12:30',
    servedEyebrow: 'Astana · lunch is served',
    title: ['This is what', 'the whole chain is for'],
    cards: [
      { t: 'Steak, 220 g', s: 'doneness under control' },
      { t: '+75 °C at the core', s: 'logged in eQamqorlyq' },
      { t: 'Kitchen to table — 12 min', s: 'served right on schedule' },
      { t: 'Medically balanced diet', s: 'therapeutic diets 1–15' },
    ],
    final: ['And so —', 'every day'],
    stats: [
      { l: 'portions daily' },
      { l: 'facilities' },
      { l: 'cities' },
    ],
  },
  journey: {
    eyebrow: "A plate's journey — in reverse",
    head: ['From the plate —', 'to the order'],
    intro:
      'Five steps every portion goes through. Scroll — each process unfolds right before your eyes.',
    stages: [
      {
        time: '12:30',
        step: 'Result',
        title: 'The table is set',
        text: 'A hot lunch on the table — balanced, up to medical standards, right on time. This is the moment the patient sees. Now let us rewind: what came before it?',
        meta: ['6,000+ portions a day', 'Therapeutic diets 1–15'],
      },
      {
        time: '09:40',
        step: 'Cooking',
        title: 'The kitchen at work',
        text: 'Chefs cook by technological charts. Core temperature, timing, portion weight — all logged and sent to eQamqorlyq.',
        meta: ['Control at +75 °C and above', 'A chart for every dish'],
      },
      {
        time: '07:15',
        step: 'Prep',
        title: 'Cleaning & preparation',
        text: 'Washing, cleaning, cutting. Sanitary zones are separated, tools are color-coded, every step passes HACCP control.',
        meta: ['Separate zones', 'Labeled equipment'],
      },
      {
        time: '05:00',
        step: 'Logistics',
        title: 'Supply delivery',
        text: 'Verified suppliers, an unbroken cold chain, acceptance by waybill. No product reaches the kitchen without documents and a quality check.',
        meta: ['Cold chain −18 °C', 'Acceptance by waybill'],
      },
      {
        time: 'Yesterday',
        step: 'Start',
        title: 'Request & order',
        text: 'It all starts here: the facility submits a request, a dietitian builds the daily menu, and the system calculates procurement volumes.',
        meta: ['Menu by a dietitian', 'Automated calculation'],
      },
    ],
  },
  features: {
    eyebrow: 'What we do',
    head: ['A full cycle of', 'catering organization'],
    lead: 'From sourcing products to digital quality control on the patient’s plate — we own every step.',
    items: [
      { icon: '🛡️', title: 'Quality control', text: 'We inspect products, follow sanitary standards and control every stage of cooking.' },
      { icon: '🥗', title: 'Balanced nutrition', text: 'We build diets to medical requirements, making food not only healthy but delicious.' },
      { icon: '🏅', title: 'Experience & expertise', text: 'Over 8 years in business, a team of 200+ specialists who know their craft.' },
      { icon: '🎯', title: 'Individual approach', text: 'We adapt the menu to clients’ needs and each facility’s requirements.' },
      { icon: '⚙️', title: 'Technology & automation', text: 'We deploy digital solutions for quality control, accounting and logistics.' },
      { icon: '🔒', title: 'Reliability & stability', text: 'We guarantee uninterrupted supply, precise order fulfillment and top-tier service.' },
    ],
  },
  stats: {
    head: ['OpenSoulInc', 'in numbers'],
    items: [
      { value: 40, suffix: '+', label: 'Completed projects' },
      { value: 200, suffix: '+', label: 'Qualified employees' },
      { value: 17, suffix: 'M', label: 'Portions prepared' },
      { value: 6000, suffix: '+', label: 'People served daily' },
    ],
  },
  about: {
    eyebrow: 'About the company',
    head: ['Why they', 'choose us'],
    p1: 'We strive to keep pace with the times, bringing modern technology into therapeutic and public catering. Process automation and digital solutions for quality and logistics let us work more efficiently.',
    p2: 'Quality control at every stage, modern cooking technology and a professional team let us provide tasty, safe and healthy food. Facilities in 5 regions of Kazakhstan trust us.',
    cards: [
      { i: '🏥', t: 'Hospitals', s: 'Therapeutic diets 1–15' },
      { i: '🎓', t: 'Schools', s: 'Hot meals' },
      { i: '🏭', t: 'Enterprises', s: 'Corporate menu' },
      { i: '🎪', t: 'Catering', s: 'Events of any scale' },
    ],
  },
  timeline: {
    eyebrow: 'The path',
    head: ['Growth of', 'OpenSoulInc'],
    items: [
      { year: '2016', title: 'Company founded', text: 'Uninterrupted catering during construction of the “Abu Dhabi” multifunctional complex in Astana.' },
      { year: '2017', title: 'Market entry', text: 'Catering for the international “Winter Universiade 2017” in Almaty.' },
      { year: '2018', title: 'Expansion', text: 'Broadened operations through catering services. Opened 8 branches across Kazakhstan.' },
      { year: '2019+', title: 'Digitalization', text: 'Developed and deployed the “eQamqorlyq” digital suite for patient interaction and quality control.' },
    ],
  },
  trust: {
    eyebrow: 'Trusted by',
    clients: [
      { icon: '🏥', name: 'City Hospital No. 1, Astana' },
      { icon: '👶', name: "Children's Hospital No. 1, Astana" },
      { icon: '🎓', name: 'Almaty schools' },
      { icon: '🏛️', name: 'National Hospital, MC of the Presidential Affairs' },
      { icon: '🎿', name: 'Universiade 2017' },
      { icon: '🍽️', name: '“Restaurant Business” LLP' },
      { icon: '🛡️', name: 'Military units of Kazakhstan' },
      { icon: '🏗️', name: '“Abu Dhabi” complex' },
    ],
  },
  news: {
    eyebrow: 'News',
    head: ['What is', 'happening'],
    lead: 'Projects, deployments and company events — the essentials, briefly.',
    items: [
      { emoji: '🍲', tag: 'News', date: 'Dec 24, 2025', title: 'Homestyle: hot meals for soldiers', text: 'In fighting the flood everyone’s effort matters. While servicemen respond to the disaster, we supply them with hot provisions.' },
      { emoji: '📱', tag: 'Technology', date: 'Oct 01, 2024', title: 'eQamqorlyq system deployed', text: 'The innovative eQamqorlyq system was deployed at 8 facilities to improve service quality and support health.' },
      { emoji: '🔬', tag: 'Projects', date: 'Dec 24, 2025', title: 'HACCP pilot at the National Hospital', text: 'A pilot project to deploy the e-Qamqorlyq suite — an electronic HACCP system — launched at the National Hospital.' },
      { emoji: '🍱', tag: 'News', date: 'Feb 28, 2023', title: 'Lunch-box system introduced', text: 'This school year free meal coverage in Almaty grew by nearly 40% — about 133,000 children now receive it.' },
      { emoji: '🤝', tag: 'Events', date: 'Apr 16, 2025', title: 'Business visit and professional exchange', text: 'A trip to Yekaterinburg: sharing experience with international specialists in therapeutic catering.' },
      { emoji: '🎒', tag: 'Media', date: 'Feb 28, 2023', title: 'What do Almaty schoolchildren eat?', text: 'Free hot meals in metal lunch boxes were organized in four Almaty schools. The pilot was launched with local budget funds.' },
    ],
  },
  advantages: {
    eyebrow: 'Our advantages',
    head: ['Experience plus', 'technology'],
    lead: 'Process automation, digital quality control and strict safety standards let us guarantee stable, reliable service.',
    skills: [
      { name: 'Product quality', value: 95 },
      { name: 'Service quality', value: 87 },
      { name: 'Modernization', value: 85 },
      { name: 'Digitalization', value: 82 },
    ],
    qrTitle: 'eQamqorlyq.kz',
    qrText:
      'An innovative service-quality management system for catering venues, schools and hospitals. The daily menu is published every day — accessible via QR code, with transparent, instant quality assessment.',
  },
  testimonials: {
    eyebrow: 'Testimonials',
    head: ['What people', 'say about us'],
    items: [
      { text: 'We have worked with OpenSoulInc for several years and never once faced a problem with catering. The menu is varied, dishes are always fresh, and the staff is attentive. Our patients are happy — and that’s what matters most!', name: 'Alina K.', role: 'Chief physician, City Hospital No. 1, Astana', initials: 'AK' },
      { text: 'We are very pleased with OpenSoulInc! The dishes are always fresh, tasty and meet dietary requirements. Patients speak highly of the food.', name: 'Natalya M.', role: 'Head nurse, Children’s Hospital No. 1, Astana', initials: 'NM' },
      { text: 'Choosing a catering supplier, we looked for a company that not only meets obligations but strives to grow and innovate. OpenSoulInc brings automation that makes the process transparent.', name: 'Andrey P.', role: 'Director, “Restaurant Business” LLP', initials: 'AP' },
      { text: 'As a specialist, I pay special attention to dietary balance. OpenSoulInc handles this brilliantly — the food meets every standard while staying tasty and healthy.', name: 'Marina T.', role: 'Dietitian, “Marketing Kz” LLP', initials: 'MT' },
    ],
  },
  contact: {
    ctaTitle: ['Ready to discuss', 'your project?'],
    ctaLead: 'Leave a request — we’ll estimate the cost and prepare a commercial offer for your facility.',
    eyebrow: 'Contact',
    head: ['Get in', 'touch'],
    office: 'Head office',
    city: 'Astana, Kazakhstan',
    formTitle: 'Leave a request',
    info: [
      { icon: '📞', key: 'Phone', value: '+7 747 34 32 342', href: 'tel:+77473432342' },
      { icon: '✉️', key: 'Email', value: 'info@opensoulinc.kz', href: 'mailto:info@opensoulinc.kz' },
      { icon: '📍', key: 'Address', value: 'Kerey, Zhanibek Khandar St. 5, office 33' },
      { icon: '🕗', key: 'Working hours', value: 'Mon–Fri: 8:00 — 18:00' },
    ],
  },
  footer: {
    tagline: 'Therapeutic, dietary and public catering services for hospitals, schools and institutions across Kazakhstan.',
    companyH: 'Company',
    company: [
      { label: 'About us', href: '#about' },
      { label: 'Services', href: '#features' },
      { label: 'News', href: '#news' },
      { label: 'Contact', href: '#contact' },
    ],
    infoH: 'Information',
    info: [
      { label: 'For suppliers', href: '#contact' },
      { label: 'Careers', href: '#contact' },
      { label: 'Privacy policy', href: '#contact' },
      { label: 'eQamqorlyq.kz', href: 'https://eqamqorlyq.kz', ext: true },
    ],
    rights: 'OpenSoulInc — catering services',
  },
};

const DICT = { ru, kz, en };

const LangCtx = createContext({ lang: 'ru', t: ru, setLang: () => {} });

function initialLang() {
  const saved = localStorage.getItem('osi-lang');
  return saved === 'kz' || saved === 'en' ? saved : 'ru';
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    localStorage.setItem('osi-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'kz' ? 'kk' : lang);
  }, [lang]);

  return <LangCtx.Provider value={{ lang, t: DICT[lang], setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
