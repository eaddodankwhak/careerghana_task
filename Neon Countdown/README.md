# Neon Countdown

Neon Countdown is a responsive, glass-inspired countdown timer made with plain HTML, CSS, and JavaScript. Name a moment, choose its duration and alert, and let the timer count down accurately in the browser.

## Features

- Custom countdown title and day/hour/minute/second duration fields
- Accurate timestamps with working pause, resume, and reset controls
- Remaining-time progress bar and browser tab countdown title
- Three generated alert sounds using the Web Audio API, plus Silent
- Upload an audio track; it is stored locally in the browser with IndexedDB
- Preview control and adjustable volume
- Responsive layout, keyboard focus visibility, and reduced-motion support
- No frontend frameworks or audio libraries

## Run locally

Install Node.js, then run these commands from the project folder:

```sh
npm install
npm start
```

Open <http://localhost:3000>. Uploaded sounds stay in the current browser and device; they are not included with a deployment or shared with other visitors. Browsers require a user interaction before Web Audio can play.

## Project structure

```text
Neon Countdown/
├── assets/
│   └── favicon.svg
├── css/
│   └── style.css
├── js/
│   └── app.js
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## Deploy

This is a static site. Publish the project folder (including `index.html`, `assets/`, `css/`, and `js/`) using any static hosting provider.

- **Netlify:** Create a new site from the project or its Git repository. Set the publish directory to the project root. No build command is needed. If deploying directly from a ZIP, unzip it first and upload the project folder.
- **Vercel:** Import the repository or project folder, select **Other** as the framework preset, leave the build command empty, and use `.` as the output directory.
- **GitHub Pages:** Push the project to a repository, then select the branch and project root (or `/docs`, if you place the files there) under **Settings → Pages**.

The `npm start` development server is for local use; the deployed site is served as static files.
