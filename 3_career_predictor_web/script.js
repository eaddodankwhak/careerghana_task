"use strict";

const statusMessage = document.querySelector("#status");
const quiz = document.querySelector("#quiz");
const results = document.querySelector("#results");
const progressLabel = document.querySelector("#progress-label");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const questionNumber = document.querySelector("#question-number");
const statement = document.querySelector("#statement");
const ratingScale = document.querySelector("#rating-scale");
const backButton = document.querySelector("#back-button");
const nextButton = document.querySelector("#next-button");

const questions = QUESTIONS;
let answers = [];
let currentIndex = 0;

function predictRatings(ratings) {
  if (
    !Array.isArray(ratings)
    || ratings.length !== questions.length
    || ratings.some((rating) => !Number.isInteger(rating) || rating < 1 || rating > 5)
  ) {
    throw new TypeError("Provide one whole-number rating from 1 to 5 per question.");
  }

  let node = 0;
  while (TREE.children_left[node] !== -1) {
    const feature = TREE.feature[node];
    node = ratings[feature] <= TREE.threshold[node]
      ? TREE.children_left[node]
      : TREE.children_right[node];
  }

  const counts = TREE.class_counts[node];
  const total = counts.reduce((sum, count) => sum + count, 0);
  let predictedIndex = 0;
  for (let index = 1; index < counts.length; index += 1) {
    if (counts[index] > counts[predictedIndex]) {
      predictedIndex = index;
    }
  }

  const confidence = Object.fromEntries(
    PROFILES.map((profile) => {
      const classIndex = TREE.classes.indexOf(profile);
      return [profile, Math.round((counts[classIndex] / total) * 1000) / 10];
    }),
  );
  return {
    career_category: TREE.classes[predictedIndex],
    confidence,
  };
}

function initializeQuiz() {
  if (!Array.isArray(questions) || questions.length !== 10) {
    statusMessage.classList.add("error");
    statusMessage.textContent = "The quiz model is missing its 10 questions.";
    return;
  }

  answers = Array(questions.length).fill(null);
  statusMessage.hidden = true;
  quiz.hidden = false;
  progressTrack.setAttribute("aria-valuemax", String(questions.length));
  renderQuestion();
}

function renderQuestion() {
  const question = questions[currentIndex];
  const total = questions.length;

  progressLabel.textContent = `Question ${currentIndex + 1} of ${total}`;
  questionNumber.textContent =
    `QUESTION ${String(currentIndex + 1).padStart(2, "0")} · ${question.column}`;
  statement.textContent = question.statement;
  progressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", String(currentIndex + 1));
  backButton.disabled = currentIndex === 0;
  nextButton.disabled = answers[currentIndex] === null;
  nextButton.textContent =
    currentIndex === total - 1 ? "See my result →" : "Next question →";

  ratingScale.replaceChildren();
  for (let rating = 1; rating <= 5; rating += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "rating-button";
    button.textContent = String(rating);
    button.setAttribute("aria-label", `${rating} out of 5`);
    button.setAttribute(
      "aria-pressed",
      String(answers[currentIndex] === rating),
    );
    button.addEventListener("click", () => {
      answers[currentIndex] = rating;
      renderQuestion();
    });
    ratingScale.append(button);
  }
}

function submitRatings() {
  showResults(predictRatings(answers));
}

function showResults(data) {
  quiz.hidden = true;
  statusMessage.hidden = true;
  results.hidden = false;
  results.replaceChildren();

  const kicker = document.createElement("p");
  kicker.className = "result-kicker";
  kicker.textContent = "YOUR CAREER PREDICTION";

  const heading = document.createElement("h2");
  heading.textContent = data.career_category;

  const explanation = document.createElement("p");
  explanation.className = "result-copy";
  explanation.textContent =
    "This profile best matches the patterns the model learned from the sample ratings.";

  const confidenceTitle = document.createElement("p");
  confidenceTitle.className = "confidence-title";
  confidenceTitle.textContent = "Model confidence by profile";

  const accuracyNote = document.createElement("p");
  accuracyNote.className = "accuracy-note";
  accuracyNote.textContent =
    `Held-out test accuracy: ${(TEST_ACCURACY * 100).toFixed(0)}%`;

  const confidenceList = document.createElement("div");
  confidenceList.className = "confidence-list";
  confidenceList.setAttribute("role", "img");
  confidenceList.setAttribute("aria-label", "Confidence percentages for each profile");
  for (const profile of PROFILES) {
    const value = data.confidence[profile];
    const row = document.createElement("div");
    row.className = "confidence-row";

    const name = document.createElement("span");
    name.textContent = profile;

    const track = document.createElement("span");
    track.className = "confidence-track";
    const fill = document.createElement("span");
    fill.className = "confidence-fill";
    fill.style.display = "block";
    fill.style.width = `${value}%`;
    track.append(fill);

    const percentage = document.createElement("span");
    percentage.className = "confidence-value";
    percentage.textContent = `${value.toFixed(1)}%`;

    row.append(name, track, percentage);
    confidenceList.append(row);
  }

  const retakeButton = document.createElement("button");
  retakeButton.type = "button";
  retakeButton.className = "retake-button";
  retakeButton.textContent = "Retake Quiz";
  retakeButton.addEventListener("click", resetQuiz);

  results.append(
    kicker,
    heading,
    explanation,
    confidenceTitle,
    accuracyNote,
    confidenceList,
    retakeButton,
  );
}

function resetQuiz() {
  answers = Array(questions.length).fill(null);
  currentIndex = 0;
  results.hidden = true;
  statusMessage.hidden = true;
  quiz.hidden = false;
  renderQuestion();
}

backButton.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex -= 1;
    renderQuestion();
  }
});

nextButton.addEventListener("click", () => {
  if (answers[currentIndex] === null) {
    return;
  }
  if (currentIndex === questions.length - 1) {
    submitRatings();
  } else {
    currentIndex += 1;
    renderQuestion();
  }
});

initializeQuiz();
