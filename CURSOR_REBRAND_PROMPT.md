Ты работаешь в проекте:

`/Users/ewgenn/Projects/krasnovska-ph`

Цель: сделать полный ребрендинг сайта `Krasnovska PH` в исходниках проекта. Это сайт фотографа в Польше, сейчас он выглядит аккуратно, но слишком стандартно: мягкий бежевый фон, винный акцент, классический hero/about/portfolio/services/contact. Нужно превратить его в индивидуальный, запоминающийся, дорогой и живой сайт, на который хочется вернуться и залипнуть.

Важный референс по ощущению:
`https://agentura.framer.website/contact`

Не копируй его буквально. Возьми принципы:
- editorial/agency настроение;
- крупная уверенная типографика;
- короткие фразы-манифесты;
- ощущение отбора, вкуса и характера;
- контактная секция как отдельный опыт, а не обычная форма;
- сильный ритм между пустотой, фото, текстом и микро-деталями.

Но адаптируй это под фотографа, не под креативное агентство.

## Текущий код

Проект очень простой:
- `index.html` — один большой файл, внутри HTML, CSS и JS.
- `images/` — изображения:
  - `hero.jpg`
  - `preview.jpg`
  - `work-01.jpg` ... `work-06.jpg`
  - favicons

Текущие секции:
- fixed header + mobile nav
- hero
- about
- portfolio
- services
- city/live time
- contact form
- footer

JS уже делает:
- scroll header state
- reveal animations
- active nav section
- mobile menu
- city clock
- fake contact form success

Можно полностью переписать структуру `index.html`, но не ломай простоту проекта. Не добавляй React/Vite/Next. Это должен остаться быстрый, статичный, премиальный сайт в одном файле, если нет очень сильной причины менять архитектуру.

## Главная идея ребрендинга

Сделай сайт не “фотограф портретов и lifestyle”, а личную визуальную студию:

**Krasnovska PH — photography for people who want to be remembered, not just seen.**

Направление: `editorial portrait studio / cinematic personal archive / Szczecin-based visual diary`.

Сайт должен ощущаться не как шаблон 2007 года и не как типичный глянцевый шаблон 2026 года. Нужен timeless, personal, slightly obsessive стиль: как независимый журнал, фотоархив и premium studio одновременно.

## Язык и позиционирование

Основная аудитория — Польша. Сделай текст в основном на польском, но можно оставить несколько английских фраз как editorial акценты. Русский не используй как основной язык интерфейса.

Тон:
- уверенный;
- короткий;
- дорогой;
- не “уютная фотосессия”, а “визуальная память, характер, присутствие”;
- без клише типа “ловлю искренние эмоции”, “магия момента”, “индивидуальный подход”.

Примеры направления текста:
- `Nie robimy zdjęć na chwilę. Robimy obrazy, do których się wraca.`
- `Portraits. Stories. Presence.`
- `Szczecin / Poland / wherever the light makes sense.`
- `For people, brands and couples who care how memory looks.`
- `One session. A whole new way to see yourself.`

## Дизайн-направление

Отойди от мягкого бежево-винного “женского портфолио”. Сохрани теплоту, но добавь характер и контраст.

Предпочтительная палитра:
- warm paper / ivory background;
- deep ink / near black text;
- oxblood or dark cherry as rare accent;
- muted steel/blue-gray or silver detail;
- no candy gradients;
- no generic beige-only luxury.

Типографика:
- оставь или замени шрифты, но сделай сильный контраст между крупным editorial serif и строгим grotesk/sans;
- hero title должен быть большим, но не просто “KRASNOVSKA PH по центру”;
- используй oversized section statements, narrow labels, small metadata, numbering, coordinates, timestamps;
- letter-spacing не должен быть отрицательным;
- текст не должен ломаться на mobile.

Фотографии:
- используй имеющиеся изображения, но смелее:
  - full-bleed hero;
  - editorial crops;
  - асимметричная галерея;
  - изображения могут перекрывать сетку, но не должны ломать адаптив;
  - сделай portfolio похожим на curated archive, не просто masonry-grid.

## Что нужно сделать

1. Полностью переработай визуальный язык сайта:
   - новый layout;
   - новые spacing rules;
   - новые секции;
   - новая типографика;
   - новая цветовая система;
   - более сильный header;
   - более выразительный footer.

2. Hero:
   - первый экран должен сразу продавать личность и стиль Krasnovska PH;
   - не делай обычный hero с текстом слева и кнопками;
   - используй фото как сцену, не как фон-заглушку;
   - добавь editorial details: location, availability, selected work count, current city/time, short manifesto line;
   - должен быть hint следующей секции на desktop и mobile.

3. About:
   - убрать generic “о себе”;
   - сделать как manifesto/profile;
   - добавить короткие statement blocks;
   - оставить человеческое ощущение, но без длинной воды.

4. Portfolio:
   - сделать галерею, где хочется скроллить;
   - использовать разные размеры карточек, подписи, категории;
   - добавить ощущение “selected archive”;
   - hover на desktop и clean captions на mobile;
   - возможно добавить фильтры/режимы: Portrait / Brand / Love / Event, если это не усложняет код.

5. Services:
   - переделать в premium offer list;
   - не обычные карточки;
   - каждая услуга должна иметь:
     - номер;
     - название;
     - short editorial description;
     - duration;
     - output/delivery;
     - starting price placeholder, например `od 450 zł`;
   - услуги должны быть полезны для клиента из Польши:
     - Portret editorialny
     - Personal branding
     - Love story
     - Events / lifestyle reportaż

6. Trust / booking:
   - добавь секцию или блок “booking logic”, но без реального внешнего сервиса пока;
   - показать процесс в 3-4 шага:
     - brief
     - mood / location
     - session
     - delivery
   - добавить CTA: Instagram / Telegram / Email.
   - сделать так, чтобы позже было легко встроить SimplyBook, Booksy, Fixly или Wesele z klasą ссылку.

7. Contact:
   - вдохновись Agentura contact page: контакт должен ощущаться как gate, не как скучная форма;
   - форма может остаться, но сделай ее более сильной:
     - name
     - contact
     - type of session
     - date / city
     - message
   - добавить “no pressure / serious inquiries / reply time” microcopy;
   - текущие `t.me/your_telegram` и `hello@example.com` оставь как placeholders, но пометь в коде комментариями, где заменить.

8. Motion:
   - оставить сайт легким;
   - использовать CSS transitions и существующий IntersectionObserver;
   - добавить subtle parallax/scroll details только если это не ломает performance;
   - `prefers-reduced-motion` обязательно уважать;
   - никаких тяжелых библиотек.

9. Адаптив:
   - mobile должен быть не “сжатый desktop”, а отдельный красивый опыт;
   - проверить 375px, 768px, 1440px;
   - кнопки и ссылки удобны пальцем;
   - текст нигде не налезает;
   - hero не должен обрезать лицо/важные части фото.

10. SEO/metadata:
   - обновить title/description под Польша/Szczecin;
   - оставить OG image;
   - lang лучше сделать `pl`;
   - добавить понятные alt-тексты на польском/английском.

## Запреты

- Не делать generic luxury beige template.
- Не делать SaaS/AI/agency сайт, это фотограф.
- Не делать “2026 gradient glassmorphism”.
- Не добавлять декоративные blob/orb элементы.
- Не использовать огромные скругления карточек.
- Не вкладывать card в card.
- Не добавлять тяжёлые зависимости.
- Не оставлять текущую структуру почти без изменений.
- Не делать текст длинным и водянистым.
- Не ломать существующие изображения и favicon.
- Не менять repo/deploy настройки.

## Критерии готовности

После изменений:
- сайт выглядит как индивидуальный бренд, а не шаблон;
- первый экран цепляет за 3 секунды;
- portfolio хочется листать;
- contact ощущается premium и уверенно;
- сайт хорошо смотрится на mobile;
- весь код остается понятным и редактируемым;
- нет JS ошибок в консоли;
- форма не отправляет реальные данные, но красиво показывает success state;
- все internal links работают;
- Lighthouse/performance не должен резко ухудшиться.

## Проверка

После редизайна обязательно:
- открыть сайт локально;
- проверить desktop и mobile;
- проверить меню;
- проверить якоря;
- проверить contact form success;
- проверить изображения;
- проверить, что нет горизонтального скролла;
- проверить `git diff` и кратко описать изменения.

Работай как senior product designer + frontend engineer. Не спрашивай, можно ли менять дизайн. Меняй смело, но сохраняй смысл бренда: Krasnovska PH — фотография с характером, памятью и визуальным вкусом.
