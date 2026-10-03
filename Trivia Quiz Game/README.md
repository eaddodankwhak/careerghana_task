# Neon trivia

Neon trivia is a responsive multiple-choice quiz game for phones and desktop. Choose a player name, avatar, education level, and subject, then race the 15-second timer through a shuffled ten-question round. Build a personal 3–10 question quiz in the editor and replay it whenever you like.

## Features

- Splash screen with typed welcome, animated loading bar, and skip button
- Three difficulty levels and six subject choices, including Mixed
- 10 questions and four shuffled answers per standard round
- Per-question timer, answer feedback, and answer review
- Custom quiz editor with localStorage saving
- Keyboard focus states, safe-area spacing, reduced-motion support, and mobile layouts
- Runs directly from `index.html` as well as through the local development server

## Run locally

Install Node.js, then from this folder run:

```sh
npm install
npm start
```

Open the address printed by `serve` (by default, <http://localhost:3000>). You can also open `index.html` directly; the game itself uses classic scripts and does not require a server or network API. Google Fonts are an optional online enhancement.

## Folder structure

```text
Trivia Quiz Game/
├── assets/
│   ├── logo.webp
│   └── bulb.webp
├── css/
│   └── style.css
├── js/
│   ├── questions.js
│   └── app.js
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
└── README.md
```

## Add or edit questions

Open `js/questions.js` and edit the `QUESTION_BANK` object. Add question objects under one of the three level keys (`Elementary`, `High School`, or `University`) and one of the subject keys (`Maths`, `Science`, `History`, `Sports`, or `English`). Each question has this shape:

```js
{
  question: "What is 2 + 2?",
  options: ["4", "3", "5", "6"],
  correctIndex: 0
}
```

`correctIndex` is zero-based and identifies the correct choice in `options`. Keep at least 10 entries in every subject/level group so standard rounds can always select ten distinct questions. For custom quizzes, use **Make my own questions** in the game; custom questions are saved in the browser's local storage.

The **Mixed** group is generated from the first two questions of each of the five topic groups at that level, so edits to those groups are reflected in Mixed automatically.
