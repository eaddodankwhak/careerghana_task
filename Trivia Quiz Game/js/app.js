(function () {
  "use strict";

  var AVATARS = ["🦊", "🐼", "🐸", "🦄", "🐙", "🐯", "🤖", "🐧"];
  var SCREEN_IDS = ["splash-screen", "setup-screen", "editor-screen", "loading-screen", "quiz-screen", "results-screen"];
  var STORAGE_KEY = "neon-trivia-custom-questions";
  var state = {
    player: { name: "", avatar: AVATARS[0], level: "Elementary", subject: "Mixed" },
    customQuestions: [],
    customMode: false,
    questions: [],
    currentIndex: 0,
    results: [],
    timerId: null,
    questionStartedAt: 0,
    advancing: false
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function showScreen(id) {
    SCREEN_IDS.forEach(function (screenId) {
      byId(screenId).hidden = screenId !== id;
    });
    window.scrollTo(0, 0);
  }

  function setImageFallback(image) {
    image.addEventListener("error", function () {
      image.hidden = true;
      var fallback = image.parentElement.querySelector(".image-fallback");
      if (fallback) fallback.style.display = "inline";
    });
  }

  function shuffle(items) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var value = copy[i];
      copy[i] = copy[j];
      copy[j] = value;
    }
    return copy;
  }

  function cloneAndShuffleQuestion(item) {
    var options = item.options.map(function (text, index) {
      return { text: text, correct: index === item.correctIndex };
    });
    var shuffled = shuffle(options);
    return {
      question: item.question,
      options: shuffled.map(function (option) { return option.text; }),
      correctIndex: shuffled.findIndex(function (option) { return option.correct; }),
      subject: item.subject || ""
    };
  }

  function buildAvatarChoices() {
    var container = byId("avatar-options");
    AVATARS.forEach(function (avatar, index) {
      var label = document.createElement("label");
      label.className = "avatar-choice";
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "avatar";
      input.value = avatar;
      input.checked = index === 0;
      input.setAttribute("aria-label", "Avatar " + (index + 1));
      var emoji = document.createElement("span");
      emoji.textContent = avatar;
      label.append(input, emoji);
      container.appendChild(label);
    });
  }

  function buildAnswerEditor() {
    var container = byId("custom-answers");
    for (var i = 0; i < 4; i += 1) {
      var row = document.createElement("label");
      row.className = "answer-choice";
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "correct-answer";
      radio.value = String(i);
      radio.required = true;
      radio.checked = i === 0;
      radio.setAttribute("aria-label", "Mark answer " + (i + 1) + " as correct");
      var input = document.createElement("input");
      input.className = "answer-input";
      input.type = "text";
      input.maxLength = 160;
      input.placeholder = "Answer " + (i + 1);
      input.required = true;
      input.setAttribute("aria-label", "Answer " + (i + 1));
      row.append(radio, input);
      container.appendChild(row);
    }
  }

  function validCustomQuestions(value) {
    return Array.isArray(value) && value.length <= 10 && value.every(function (item) {
      return item && typeof item.question === "string" && item.question.trim() &&
        Array.isArray(item.options) && item.options.length === 4 &&
        item.options.every(function (option) { return typeof option === "string" && option.trim(); }) &&
        Number.isInteger(item.correctIndex) && item.correctIndex >= 0 && item.correctIndex < 4;
    });
  }

  function persistCustomQuestions() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.customQuestions));
      return true;
    } catch (error) {
      console.error("Unable to save custom questions in localStorage.", error);
      return false;
    }
  }

  function restoreCustomQuestions() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      var parsed = JSON.parse(saved);
      if (validCustomQuestions(parsed)) {
        state.customQuestions = parsed;
      } else {
        console.warn("Saved custom questions were invalid and were ignored.");
      }
    } catch (error) {
      console.error("Unable to load custom questions from localStorage.", error);
    }
  }

  function renderCustomQuestions() {
    var list = byId("custom-question-list");
    list.replaceChildren();
    state.customQuestions.forEach(function (item, index) {
      var row = document.createElement("li");
      row.className = "custom-question-item";
      var text = document.createElement("span");
      text.textContent = (index + 1) + ". " + item.question;
      var remove = document.createElement("button");
      remove.className = "remove-question";
      remove.type = "button";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", "Remove question " + (index + 1));
      remove.addEventListener("click", function () {
        state.customQuestions.splice(index, 1);
        var saved = persistCustomQuestions();
        renderCustomQuestions();
        if (!saved) byId("editor-error").textContent = "Question removed for this session, but the change could not be saved on this device.";
      });
      row.append(text, remove);
      list.appendChild(row);
    });
    byId("question-total").textContent = state.customQuestions.length + " / 10";
    byId("play-custom").disabled = state.customQuestions.length < 3;
    byId("add-question").disabled = state.customQuestions.length >= 10;
    if (state.customQuestions.length >= 10) {
      byId("editor-error").textContent = "You have reached the 10-question limit.";
    } else if (state.customQuestions.length >= 3) {
      byId("editor-error").textContent = "";
    }
  }

  function readPlayerFromSetup() {
    var selectedAvatar = document.querySelector('input[name="avatar"]:checked');
    return {
      name: byId("nickname").value.trim(),
      avatar: selectedAvatar ? selectedAvatar.value : AVATARS[0],
      level: document.querySelector('input[name="level"]:checked').value,
      subject: byId("subject").value
    };
  }

  function collectQuestions(customMode) {
    if (customMode) {
      return shuffle(state.customQuestions).map(cloneAndShuffleQuestion);
    }
    var levelBank = window.QUESTION_BANK[state.player.level];
    var selected = [];
    if (state.player.subject === "Mixed") {
      selected = levelBank.Mixed.map(function (item) {
        return Object.assign({}, item, { subject: item.subject });
      });
    } else {
      selected = levelBank[state.player.subject].map(function (item) {
        return Object.assign({}, item, { subject: state.player.subject });
      });
    }
    return shuffle(selected).slice(0, 10).map(cloneAndShuffleQuestion);
  }

  function beginLoading(customMode) {
    window.clearInterval(state.timerId);
    state.customMode = customMode;
    state.questions = collectQuestions(customMode);
    state.currentIndex = 0;
    state.results = [];
    byId("player-pill").hidden = false;
    byId("header-avatar").textContent = state.player.avatar;
    byId("header-name").textContent = state.player.name;
    byId("loading-avatar").textContent = state.player.avatar;
    byId("loading-name").textContent = state.player.name;
    byId("loading-level").textContent = state.player.level;
    byId("loading-subject").textContent = customMode ? "Your quiz" : state.player.subject;
    byId("loading-count").textContent = String(state.questions.length);
    byId("loading-status").textContent = "Loading questions...";
    byId("quiz-loading-progress").style.width = "0%";
    byId("start-quiz").hidden = true;
    byId("loading-back").hidden = false;
    showScreen("loading-screen");

    var progress = 0;
    state.timerId = window.setInterval(function () {
      progress = Math.min(progress + 10, 100);
      byId("quiz-loading-progress").style.width = progress + "%";
      if (progress >= 100) {
        window.clearInterval(state.timerId);
        byId("loading-status").textContent = "Questions ready";
        byId("start-quiz").hidden = false;
        byId("loading-back").hidden = true;
        byId("start-quiz").focus();
      }
    }, 75);
  }

  function renderQuestion() {
    if (state.currentIndex >= state.questions.length) {
      renderResults();
      return;
    }
    state.advancing = false;
    var item = state.questions[state.currentIndex];
    byId("question-count").textContent = "Question " + (state.currentIndex + 1) + " of " + state.questions.length;
    byId("question-progress").style.width = ((state.currentIndex / state.questions.length) * 100) + "%";
    byId("quiz-avatar").textContent = state.player.avatar;
    byId("quiz-name").textContent = state.player.name;
    byId("quiz-subject").textContent = state.customMode ? "YOUR QUIZ" : item.subject.toUpperCase() + " · " + state.player.level.toUpperCase();
    byId("question-text").textContent = item.question;
    byId("answer-feedback").textContent = "";
    var options = byId("answer-options");
    options.replaceChildren();
    item.options.forEach(function (answer, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "answer-option";
      var key = document.createElement("span");
      key.className = "answer-key";
      key.textContent = String.fromCharCode(65 + index);
      var text = document.createElement("span");
      text.textContent = answer;
      button.append(key, text);
      button.addEventListener("click", function () { submitAnswer(index); });
      options.appendChild(button);
    });
    showScreen("quiz-screen");
    startQuestionTimer();
  }

  function startQuestionTimer() {
    window.clearInterval(state.timerId);
    state.questionStartedAt = Date.now();
    var bar = byId("timer-bar");
    var progress = document.querySelector(".timer-track");
    bar.style.width = "100%";
    bar.classList.remove("timer-amber", "timer-red");
    progress.setAttribute("aria-valuenow", "15");
    state.timerId = window.setInterval(function () {
      var remaining = Math.max(0, 15 - ((Date.now() - state.questionStartedAt) / 1000));
      var rounded = Math.ceil(remaining);
      bar.style.width = ((remaining / 15) * 100) + "%";
      progress.setAttribute("aria-valuenow", String(rounded));
      bar.classList.toggle("timer-amber", remaining <= 10 && remaining > 5);
      bar.classList.toggle("timer-red", remaining <= 5);
      if (remaining <= 0) submitAnswer(null);
    }, 100);
  }

  function submitAnswer(answerIndex) {
    if (state.advancing) return;
    state.advancing = true;
    window.clearInterval(state.timerId);
    var item = state.questions[state.currentIndex];
    var correct = answerIndex === item.correctIndex;
    state.results.push({
      question: item.question,
      options: item.options,
      answerIndex: answerIndex,
      correctIndex: item.correctIndex,
      correct: correct,
      subject: item.subject
    });
    var buttons = byId("answer-options").querySelectorAll("button");
    buttons.forEach(function (button, index) {
      button.disabled = true;
      if (index === item.correctIndex) button.classList.add("is-correct");
      if (answerIndex === index && !correct) button.classList.add("is-wrong");
    });
    byId("answer-feedback").textContent = answerIndex === null ? "Time's up — the correct answer is highlighted." : correct ? "That's right!" : "Not quite — the correct answer is highlighted.";
    window.setTimeout(function () {
      state.currentIndex += 1;
      renderQuestion();
    }, 1300);
  }

  function renderResults() {
    window.clearInterval(state.timerId);
    var score = state.results.filter(function (item) { return item.correct; }).length;
    byId("result-avatar").textContent = state.player.avatar;
    byId("result-name").textContent = state.player.name;
    byId("final-score").textContent = String(score);
    byId("final-total").textContent = String(state.questions.length);
    byId("result-message").textContent = score === 10 ? "Perfect score! You lit up every answer." :
      score >= 7 ? "Brilliant run — you really know your stuff." :
      score >= 4 ? "Nice effort! Every question is a chance to learn." :
      "Good start. Come back for another round and shine brighter.";
    var review = byId("answer-review");
    review.replaceChildren();
    state.results.forEach(function (item, index) {
      var row = document.createElement("li");
      row.className = "review-item";
      var question = document.createElement("p");
      question.className = "review-question";
      question.textContent = (index + 1) + ". " + item.question;
      var answer = document.createElement("p");
      answer.className = "review-answer " + (item.correct ? "correct-answer" : "wrong-answer");
      var answerLabel = document.createElement("strong");
      answerLabel.textContent = "Your answer: ";
      answer.append(answerLabel, document.createTextNode(item.answerIndex === null ? "No answer" : item.options[item.answerIndex]));
      row.append(question, answer);
      if (!item.correct) {
        var correct = document.createElement("p");
        correct.className = "review-answer correct-answer";
        var correctLabel = document.createElement("strong");
        correctLabel.textContent = "Correct answer: ";
        correct.append(correctLabel, document.createTextNode(item.options[item.correctIndex]));
        row.appendChild(correct);
      }
      review.appendChild(row);
    });
    byId("question-progress").style.width = "100%";
    showScreen("results-screen");
  }

  function resetQuestionForm() {
    byId("question-form").reset();
    document.querySelector('input[name="correct-answer"][value="0"]').checked = true;
    byId("editor-error").textContent = "";
  }

  function init() {
    document.querySelectorAll(".brand-logo, .splash-logo-wrap img, .bulb-image").forEach(setImageFallback);
    buildAvatarChoices();
    buildAnswerEditor();
    restoreCustomQuestions();
    renderCustomQuestions();

    byId("setup-form").addEventListener("submit", function (event) {
      event.preventDefault();
      state.player = readPlayerFromSetup();
      if (!state.player.name) {
        byId("setup-error").textContent = "Please enter a nickname to continue.";
        byId("nickname").focus();
        return;
      }
      byId("setup-error").textContent = "";
      beginLoading(false);
    });

    byId("open-editor").addEventListener("click", function () {
      state.player = readPlayerFromSetup();
      byId("editor-error").textContent = "";
      showScreen("editor-screen");
    });
    byId("back-to-setup").addEventListener("click", function () { showScreen("setup-screen"); });
    byId("loading-back").addEventListener("click", function () {
      window.clearInterval(state.timerId);
      showScreen(state.customMode ? "editor-screen" : "setup-screen");
    });
    byId("start-quiz").addEventListener("click", renderQuestion);
    byId("play-again").addEventListener("click", function () { beginLoading(state.customMode); });
    byId("change-settings").addEventListener("click", function () {
      byId("player-pill").hidden = true;
      showScreen("setup-screen");
      byId("nickname").focus();
    });
    byId("question-form").addEventListener("submit", function (event) {
      event.preventDefault();
      var inputs = Array.from(byId("custom-answers").querySelectorAll(".answer-input"));
      var question = byId("custom-question").value.trim();
      var answers = inputs.map(function (input) { return input.value.trim(); });
      var correct = document.querySelector('input[name="correct-answer"]:checked');
      if (!question || answers.some(function (answer) { return !answer; }) || !correct) {
        byId("editor-error").textContent = "Enter a question, all four answers, and choose the correct answer.";
        return;
      }
      if (state.customQuestions.length >= 10) {
        byId("editor-error").textContent = "You can add up to 10 questions.";
        return;
      }
      state.customQuestions.push({ question: question, options: answers, correctIndex: Number(correct.value) });
      var saved = persistCustomQuestions();
      resetQuestionForm();
      renderCustomQuestions();
      if (!saved) byId("editor-error").textContent = "Question added for this session, but could not be saved on this device.";
    });
    byId("play-custom").addEventListener("click", function () {
      if (state.customQuestions.length < 3) {
        byId("editor-error").textContent = "Add at least 3 questions before playing.";
        return;
      }
      state.player = readPlayerFromSetup();
      if (!state.player.name) {
        showScreen("setup-screen");
        byId("setup-error").textContent = "Add a nickname first, then return to your question lab.";
        byId("nickname").focus();
        return;
      }
      beginLoading(true);
    });

    var welcome = "Welcome…";
    var letterIndex = 0;
    var typeTimer = window.setInterval(function () {
      letterIndex += 1;
      byId("welcome-text").textContent = welcome.slice(0, letterIndex);
      if (letterIndex >= welcome.length) window.clearInterval(typeTimer);
    }, 105);
    byId("splash-progress").style.transitionDuration = "5s";
    window.requestAnimationFrame(function () { byId("splash-progress").style.width = "100%"; });
    var splashTimer = window.setTimeout(function () {
      window.clearInterval(typeTimer);
      showScreen("setup-screen");
    }, 5000);
    byId("skip-splash").addEventListener("click", function () {
      window.clearTimeout(splashTimer);
      window.clearInterval(typeTimer);
      byId("welcome-text").textContent = welcome;
      showScreen("setup-screen");
      byId("nickname").focus();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
}());
