"use strict";

const dateElement = document.querySelector("#today-date");
const filterSelect = document.querySelector("#category-filter");
const modeToggle = document.querySelector("#mode-toggle");
const newTipButton = document.querySelector("#new-tip");
const shareTipButton = document.querySelector("#share-tip");
const shareMenu = document.querySelector("#share-menu");
const shareWhatsApp = document.querySelector("#share-whatsapp");
const shareEmail = document.querySelector("#share-email");
const shareX = document.querySelector("#share-x");
const shareCopyButton = document.querySelector("#share-copy");
const themeToggle = document.querySelector("#theme-toggle");
const categoryElement = document.querySelector("#tip-category");
const textElement = document.querySelector("#tip-text");
const authorElement = document.querySelector("#tip-author");
const tipContent = document.querySelector("#tip-content");
const statusElement = document.querySelector("#tip-status");
const modeNote = document.querySelector("#mode-note");

let isDailyMode = true;
let currentTip = null;
let statusTimer = null;

function getTodayDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getFilteredTips() {
  const category = filterSelect.value;
  return category === "All"
    ? DAILY_TIPS
    : DAILY_TIPS.filter((tip) => tip.category === category);
}

function getDailyTip(tips) {
  const today = getTodayDate();
  const dateSeed = Number(
    `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`,
  );
  return tips[dateSeed % tips.length];
}

function chooseRandomTip(tips, previousTip) {
  const alternatives = tips.filter((tip) => tip !== previousTip);
  const choices = alternatives.length > 0 ? alternatives : tips;
  return choices[Math.floor(Math.random() * choices.length)];
}

function renderTip(tip) {
  currentTip = tip;
  categoryElement.textContent = tip.category;
  textElement.textContent = tip.text;
  authorElement.textContent = tip.author ? `— ${tip.author}` : "";
  authorElement.hidden = !tip.author;

  // Briefly removing the animated class lets the browser restart the fade.
  tipContent.classList.remove("tip-content");
  void tipContent.offsetWidth;
  tipContent.classList.add("tip-content");
}

function showTip(tip) {
  renderTip(tip);
  statusElement.textContent = "";
}

function updateModeControls() {
  modeToggle.textContent = isDailyMode
    ? "Switch to random mode"
    : "Switch to Tip of the Day";
  modeToggle.setAttribute("aria-pressed", String(!isDailyMode));
  modeNote.textContent = isDailyMode
    ? "Tip of the Day is selected by today's date and stays the same throughout the day."
    : "Random mode draws from every tip in the selected category and avoids repeating the previous tip.";
}

function showCurrentModeTip(avoidRepeat = false) {
  const tips = getFilteredTips();
  if (tips.length === 0) {
    statusElement.textContent = "There are no tips in this category.";
    return;
  }

  if (isDailyMode) {
    showTip(getDailyTip(tips));
    return;
  }

  showTip(chooseRandomTip(tips, avoidRepeat ? currentTip : null));
}

function updateDate() {
  const today = getTodayDate();
  dateElement.dateTime = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  dateElement.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(today);
}

function getShareText() {
  return currentTip.author
    ? `${currentTip.text} — ${currentTip.author}`
    : currentTip.text;
}

async function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const temporaryInput = document.createElement("textarea");
      temporaryInput.value = text;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";
      document.body.append(temporaryInput);
      temporaryInput.select();
      const copied = document.execCommand("copy");
      temporaryInput.remove();
      if (!copied) {
        throw new Error("The browser did not allow copying to the clipboard.");
      }
    }
    return true;
  } catch (error) {
    statusElement.textContent = `Could not copy the tip: ${error.message}`;
    return false;
  }
}

function showCopiedMessage() {
  window.clearTimeout(statusTimer);
  statusElement.textContent = "Copied!";
  statusTimer = window.setTimeout(() => {
    statusElement.textContent = "";
  }, 2000);
}

function closeShareMenu(returnFocus = false) {
  shareMenu.hidden = true;
  shareTipButton.setAttribute("aria-expanded", "false");
  if (returnFocus) {
    shareTipButton.focus();
  }
}

function openShareMenu() {
  if (!currentTip) {
    return;
  }

  const text = getShareText();
  const encodedText = encodeURIComponent(text);
  shareWhatsApp.href = `https://wa.me/?text=${encodedText}`;
  shareX.href = `https://twitter.com/intent/tweet?text=${encodedText}`;
  shareEmail.href =
    `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(text)}`;
  shareMenu.hidden = false;
  shareTipButton.setAttribute("aria-expanded", "true");
  shareMenu.querySelector('[role="menuitem"]').focus();
}

async function shareCurrentTip() {
  if (!currentTip) {
    return;
  }

  if (typeof navigator.share === "function") {
    try {
      await navigator.share({text: getShareText()});
      closeShareMenu();
      return;
    } catch {
      // Web Share can be unavailable for a local file, so offer explicit links.
    }
  }
  openShareMenu();
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  themeToggle.textContent = isDark ? "Switch to light mode" : "Switch to dark mode";
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

modeToggle.addEventListener("click", () => {
  isDailyMode = !isDailyMode;
  updateModeControls();
  showCurrentModeTip(!isDailyMode);
});

newTipButton.addEventListener("click", () => {
  if (isDailyMode) {
    isDailyMode = false;
    updateModeControls();
  }
  showCurrentModeTip(true);
});

filterSelect.addEventListener("change", () => {
  showCurrentModeTip(true);
});

shareTipButton.addEventListener("click", () => {
  if (shareMenu.hidden) {
    void shareCurrentTip();
  } else {
    closeShareMenu();
  }
});

shareMenu.addEventListener("click", async (event) => {
  const menuItem = event.target.closest('[role="menuitem"]');
  if (!menuItem) {
    return;
  }

  if (menuItem === shareCopyButton) {
    closeShareMenu();
    if (await copyText(getShareText())) {
      showCopiedMessage();
    }
  } else {
    closeShareMenu();
  }
});

shareMenu.addEventListener("keydown", (event) => {
  const items = [...shareMenu.querySelectorAll('[role="menuitem"]')];
  const currentIndex = items.indexOf(document.activeElement);
  let nextIndex = currentIndex;

  if (event.key === "Escape") {
    event.preventDefault();
    closeShareMenu(true);
    return;
  }
  if (event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % items.length;
  } else if (event.key === "ArrowUp") {
    nextIndex = (currentIndex - 1 + items.length) % items.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = items.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  items[nextIndex].focus();
});

document.addEventListener("click", (event) => {
  if (!shareMenu.hidden && !event.target.closest(".share-control")) {
    closeShareMenu();
  }
});

shareTipButton.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !shareMenu.hidden) {
    event.preventDefault();
    closeShareMenu(true);
  }
});

themeToggle.addEventListener("click", toggleTheme);

updateDate();
updateModeControls();
showCurrentModeTip();
