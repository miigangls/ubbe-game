# Ubbe Game

Plataforma de minijuegos educativos de tecnología y mecánica, desarrollada como proyecto de portafolio. Una sola página con seis juegos integrados, modo oscuro, estadísticas persistentes y accesibilidad completa.

## Juegos

| Juego | Descripción |
|---|---|
| **Sopa de Letras** | Encuentra palabras técnicas ocultas en la cuadrícula |
| **Encuentra Caras** | Voltea cartas y encuentra todas las parejas |
| **Sudoku** | Rellena la cuadrícula 9×9 sin repetir números |
| **Ahorcado** | Adivina palabras técnicas letra por letra (SVG progresivo) |
| **Quiz de Tecnología** | 10 preguntas con temporizador por ronda |
| **Binario** | Convierte números entre decimal y binario contra el reloj |

Sopa de Letras, Ahorcado y Quiz ofrecen tres categorías: **Mecánica**, **Electrónica** e **Informática**. El modo Binario tiene dos direcciones: Dec → Bin y Bin → Dec.

## Stack

- HTML5 + Vanilla JavaScript (sin frameworks)
- SCSS modular compilado con Sass
- Bootstrap 4 (grid, modals)
- `localStorage` para estadísticas y preferencia de tema

## Estructura

```
ubbe-game/
├── index.html          # SPA — todos los modales aquí
├── js/
│   ├── app.js          # Inicialización y tema
│   ├── scores.js       # Estadísticas (localStorage)
│   ├── wordfind.js     # Motor sopa de letras
│   ├── wordfindgame.js # UI sopa de letras
│   ├── wordsearch-data.js
│   ├── memory-game.js
│   ├── sudoku.js
│   ├── hangman.js
│   ├── quiz.js
│   ├── quiz-data.js
│   └── binary.js
├── scss/
│   ├── main.scss       # Punto de entrada
│   ├── _variables.scss
│   ├── _base.scss
│   ├── _navbar.scss
│   ├── _landing.scss
│   ├── _dark-mode.scss
│   ├── _animations.scss
│   └── games/          # Un partial por juego
└── css/
    └── main.css        # Generado — no editar
```

## Desarrollo

```bash
npm install
npm run dev        # Sass watch + live-server en localhost:3000
```

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Sass watch + live-server (desarrollo) |
| `npm run build:css` | Compila SCSS minificado a `css/main.css` |
| `npm run watch:css` | Solo Sass watch, sin servidor |

## Características

- **Dark mode** — toggle en la navbar, persistido en `localStorage`
- **Estadísticas** — puntuaciones por juego accesibles desde la navbar
- **Accesibilidad** — skip link, roles ARIA, `aria-live` en mensajes de estado
- **Animaciones de entrada** — cards con fade-in escalonado
- **Responsive** — grid Bootstrap adaptado a móvil
