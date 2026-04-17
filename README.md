# HIT LAB - Multilingual Landing Page

## 🌍 Мовна архітектура / Language Architecture

Сайт підтримує 3 мови з автоматичним перенаправленням на основі мови браузера:

- **UA** (Українська) - Стандартна версія
- **PL** (Польська) - Локалізована версія
- **EN** (English) - English version

## 📁 Структура файлів / File Structure

```
/
├── index.html           # Маршрутизація / Router
├── router.js            # JavaScript маршрутизація
├── .htaccess            # Apache маршрутизація
├── styles.css           # Загальні стилі (спільні)
├── js/
│   └── main.js          # Загальний JavaScript
├── images/              # Зображення
├── ua/
│   └── index.html       # Українська версія
├── pl/
│   └── index.html       # Польська версія
└── en/
    └── index.html       # Англійська версія
```

## 🚀 Як працює маршрутизація / How Routing Works

### На сервері з .htaccess (Apache):
1. Користувач входить на `https://example.com/`
2. `.htaccess` перевіряє заголовок `Accept-Language` браузера
3. Автоматично перенаправляє на `/ua/`, `/pl/` або `/en/`
4. CSS та JS завантажуються з батьківської папки

### На локальному комп'ютері (router.js):
1. Користувач входить на `http://localhost/`
2. `router.js` перевіряє мову браузера
3. Перенаправляє на відповідну папку

## 🔄 Мовний перемикач / Language Switcher

На кожній сторінці є мовний перемикач в навігації:
```
UA | PL | EN
```
Користувачі можуть перейти на будь-яку мову одним кліком.

## ✏️ Редагування контенту / Editing Content

### Для кожної мови:
- `/ua/index.html` - Редагуйте український контент
- `/pl/index.html` - Редагуйте польський контент
- `/en/index.html` - Редагуйте англійський контент

### Спільні ресурси (не змінюються):
- `styles.css` - CSS для всіх мов
- `js/main.js` - JavaScript для всіх мов
- `images/` - Зображення для всіх мов

## 📝 Технічні деталі / Technical Details

### CSS для мовного перемикача:
```css
.lang-switcher { ... }
.lang-link { ... }
.lang-link.active { ... }
```

### HTML структура навігації:
```html
<nav>
  <a href="/ua/" class="nav-logo">HIT LAB ↗</a>
  <div class="lang-switcher">
    <a href="/ua/" class="lang-link active">UA</a>
    <a href="/pl/" class="lang-link">PL</a>
    <a href="/en/" class="lang-link">EN</a>
  </div>
  <a href="#kontakt" class="nav-cta">...</a>
</nav>
```

## 🔧 Встановлення на сервер / Server Setup

### Вимоги / Requirements:
- Apache с `mod_rewrite` дозволеним
- PHP не потрібний

### Кроки / Steps:
1. Завантажте всі файли на сервер
2. Переконайтесь, що `.htaccess` присутній в кореневій папці
3. Перевірте, що `mod_rewrite` увімкнено
4. Протестуйте на `https://yoursite.com/`

## 🧪 Тестування / Testing

### Локально:
```bash
# Стартуйте простий HTTP сервер
python -m http.server 8000
# Тоді відкрийте http://localhost:8000/
```

### На сервері:
- Відвідайте основний домен
- Перевірте, що вас перенаправляє на правильну мову
- Протестуйте мовний перемикач

## 📱 Адаптивність / Responsive

Всі три версії повністю адаптивні для мобільних пристроїв.

## 🎨 Кольорова схема / Color Scheme

Спільна для всіх мов в `styles.css`:
- Основний колір: `#FF5C35` (Coral)
- Фон: `#FFF5E6` (Cream)
- Текст: `#1A1208` (Ink)

---

**Останнє оновлення / Last Updated:** 2026
**Версія / Version:** 1.0
