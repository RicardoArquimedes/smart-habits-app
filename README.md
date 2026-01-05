# Smart Habits 🧠✨

Smart Habits es una aplicación web moderna para gestionar hábitos diarios, construida con **Angular (standalone + signals)** y enfocada en **arquitectura limpia, accesibilidad y diseño adaptable (Light / Dark mode)**.

---

## 🚀 Features

- ✅ Crear y completar hábitos
- 📊 Estadísticas en tiempo real (Total, Completed, Pending, Progress)
- 🔍 Filtros: Todo / Completado / Pendiente
- 🌗 Light & Dark mode con persistencia
- 💾 Persistencia en LocalStorage
- ♿ Accesibilidad (ARIA, semantic HTML)
- 🧱 Arquitectura escalable y desacoplada

---

## 🧩 Tech Stack

- **Angular 19+**
  - Standalone components
  - Signals
- **TypeScript**
- **CSS Variables (Design Tokens)**
- **LocalStorage**
- **Semantic HTML + ARIA**

---

## 🗂️ Project Structure

```txt
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       └── theme/
│   │           └── theme.service.ts
│   │
│   ├── features/
│   │   └── habits/
│   │       ├── components/
│   │       │   ├── habit-form/
│   │       │   ├── habit-list/
│   │       │   ├── habit-stats/
│   │       │   └── habit-filters/
│   │       ├── store/
│   │       │   └── habits.store.ts
│   │       └── models/
│   │           └── habit.model.ts
│   │
│   ├── app.component.ts
│   └── app.routes.ts
│
├── styles.css
└── main.ts
