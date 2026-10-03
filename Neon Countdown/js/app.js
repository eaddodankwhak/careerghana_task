(function () {
  "use strict";

  var databaseName = "neon-countdown";
  var storeName = "tracks";
  var tickInterval = null;
  var audioInterval = null;
  var previewTimeout = null;
  var audioContext = null;
  var activeOscillators = new Set();
  var trackUrls = new Map();
  var currentAudio = null;
  var timer = {
    title: "",
    durationMs: 0,
    remainingMs: 0,
    endAt: 0,
    paused: false,
    finished: false,
    sound: "neon-beeps"
  };
  var elements = {};

  function cacheElements() {
    [
      "setup-screen", "timer-screen", "countdown-form", "timer-title",
      "duration-days", "duration-hours", "duration-minutes", "duration-seconds",
      "alert-sound", "audio-upload", "upload-name", "volume", "volume-value",
      "preview-sound", "form-error", "countdown-title", "days-value", "hours-value",
      "minutes-value", "seconds-value", "timer-progress", "timer-progress-track",
      "remaining-label", "timer-status", "pause-resume", "reset-timer", "stop-alert"
    ].forEach(function (id) {
      elements[id] = document.getElementById(id);
    });
  }

  function openDatabase() {
    return new Promise(function (resolve, reject) {
      if (!("indexedDB" in window)) {
        reject(new Error("This browser does not support on-device track storage."));
        return;
      }
      var request = window.indexedDB.open(databaseName, 1);
      request.onupgradeneeded = function () {
        var database = request.result;
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName, { keyPath: "id" });
        }
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error("Could not open track storage.")); };
    });
  }

  function withTrackStore(mode, operation) {
    return openDatabase().then(function (database) {
      return new Promise(function (resolve, reject) {
        var transaction = database.transaction(storeName, mode);
        var store = transaction.objectStore(storeName);
        var result;
        try {
          result = operation(store);
        } catch (error) {
          database.close();
          reject(error);
          return;
        }
        transaction.oncomplete = function () {
          database.close();
          resolve(result && result.result !== undefined ? result.result : result);
        };
        transaction.onerror = function () {
          var error = transaction.error || new Error("Track storage operation failed.");
          database.close();
          reject(error);
        };
        transaction.onabort = function () {
          var error = transaction.error || new Error("Track storage operation was cancelled.");
          database.close();
          reject(error);
        };
      });
    });
  }

  function loadTracks() {
    return withTrackStore("readonly", function (store) { return store.getAll(); }).then(function (tracks) {
      tracks.forEach(addTrackOption);
    });
  }

  function addTrackOption(track) {
    var value = "track:" + track.id;
    if (Array.from(elements["alert-sound"].options).some(function (option) { return option.value === value; })) return;
    var option = document.createElement("option");
    option.value = value;
    option.textContent = track.name;
    elements["alert-sound"].appendChild(option);
  }

  function getTrackUrl(id) {
    if (trackUrls.has(id)) return Promise.resolve(trackUrls.get(id));
    return withTrackStore("readonly", function (store) { return store.get(id); }).then(function (track) {
      if (!track || !track.blob) throw new Error("That saved track could not be found on this device.");
      var url = URL.createObjectURL(track.blob);
      trackUrls.set(id, url);
      return url;
    });
  }

  function ensureAudioContext() {
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error("Web Audio is not supported by this browser.");
    if (!audioContext) audioContext = new AudioContextClass();
    return audioContext.resume().then(function () { return audioContext; });
  }

  function stopAudio() {
    window.clearInterval(audioInterval);
    window.clearTimeout(previewTimeout);
    audioInterval = null;
    previewTimeout = null;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    activeOscillators.forEach(function (oscillator) {
      try { oscillator.stop(); } catch (error) { /* An oscillator may already have stopped. */ }
    });
    activeOscillators.clear();
  }

  function playTone(frequency, startTime, duration, waveform, endFrequency) {
    if (!audioContext) return;
    var oscillator = audioContext.createOscillator();
    var gain = audioContext.createGain();
    var volume = Number(elements.volume.value) / 100;
    var peak = Math.max(0.0001, volume * 0.13);
    oscillator.type = waveform || "sine";
    oscillator.frequency.setValueAtTime(frequency, startTime);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, startTime + duration);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(peak, startTime + Math.min(.025, duration / 4));
    gain.gain.setValueAtTime(peak, Math.max(startTime + .03, startTime + duration - .045));
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    activeOscillators.add(oscillator);
    oscillator.onended = function () {
      activeOscillators.delete(oscillator);
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + .01);
  }

  function playSynthCycle(sound) {
    if (!audioContext) return;
    var now = audioContext.currentTime + .015;
    if (sound === "synth-chime") {
      [659.25, 783.99, 987.77].forEach(function (frequency, index) {
        playTone(frequency, now + (index * .19), .5, "sine");
      });
    } else if (sound === "pulse-siren") {
      playTone(570, now, .76, "triangle", 950);
      playTone(950, now + .82, .76, "triangle", 570);
    } else {
      [880, 1174.66, 880].forEach(function (frequency, index) {
        playTone(frequency, now + (index * .17), .12, "sine");
      });
    }
  }

  function playSelectedSound(preview) {
    var sound = elements["alert-sound"].value;
    stopAudio();
    if (sound === "silent") return Promise.resolve();
    if (sound.indexOf("track:") === 0) {
      var trackId = sound.slice(6);
      return getTrackUrl(trackId).then(function (url) {
        var audio = new Audio(url);
        currentAudio = audio;
        audio.volume = Number(elements.volume.value) / 100;
        audio.loop = !preview;
        return audio.play().then(function () {
          if (preview) {
            previewTimeout = window.setTimeout(stopAudio, 3000);
          }
        });
      });
    }
    return ensureAudioContext().then(function () {
      playSynthCycle(sound);
      if (!preview) {
        audioInterval = window.setInterval(function () { playSynthCycle(sound); }, sound === "pulse-siren" ? 1650 : 1150);
      } else {
        previewTimeout = window.setTimeout(stopAudio, 2700);
      }
    });
  }

  function secondsLabel(milliseconds) {
    var seconds = Math.max(0, Math.ceil(milliseconds / 1000));
    var days = Math.floor(seconds / 86400);
    var hours = Math.floor((seconds % 86400) / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainder = seconds % 60;
    if (days > 0) return days + "d " + String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":" + String(remainder).padStart(2, "0");
    if (hours > 0) return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":" + String(remainder).padStart(2, "0");
    return String(minutes).padStart(2, "0") + ":" + String(remainder).padStart(2, "0");
  }

  function renderTime(milliseconds) {
    var totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    elements["days-value"].textContent = String(days).padStart(2, "0");
    elements["hours-value"].textContent = String(hours).padStart(2, "0");
    elements["minutes-value"].textContent = String(minutes).padStart(2, "0");
    elements["seconds-value"].textContent = String(seconds).padStart(2, "0");
    elements["remaining-label"].textContent = secondsLabel(milliseconds);
    document.title = secondsLabel(milliseconds) + " · " + timer.title + " — Neon Countdown";
    var percentage = timer.durationMs === 0 ? 0 : Math.max(0, Math.min(100, (milliseconds / timer.durationMs) * 100));
    elements["timer-progress"].style.width = percentage + "%";
    elements["timer-progress-track"].setAttribute("aria-valuenow", String(Math.round(percentage)));
  }

  function finishCountdown() {
    window.clearInterval(tickInterval);
    tickInterval = null;
    timer.remainingMs = 0;
    timer.paused = false;
    timer.finished = true;
    renderTime(0);
    elements["timer-screen"].classList.add("is-finished");
    elements["timer-status"].textContent = "Time is up!";
    elements["pause-resume"].hidden = true;
    elements["stop-alert"].hidden = false;
    elements["stop-alert"].focus();
    if (timer.sound !== "silent") {
      playSelectedSound(false).catch(function (error) {
        elements["timer-status"].textContent = "Time is up, but audio could not play: " + error.message;
      });
    }
  }

  function tick() {
    var remaining = Math.max(0, timer.endAt - Date.now());
    timer.remainingMs = remaining;
    renderTime(remaining);
    if (remaining <= 0) finishCountdown();
  }

  function startCountdown() {
    var days = Number(elements["duration-days"].value);
    var hours = Number(elements["duration-hours"].value);
    var minutes = Number(elements["duration-minutes"].value);
    var seconds = Number(elements["duration-seconds"].value);
    var inputs = [
      [elements["duration-days"], 999],
      [elements["duration-hours"], 23],
      [elements["duration-minutes"], 59],
      [elements["duration-seconds"], 59]
    ];
    var invalidInput = inputs.find(function (entry) {
      var input = entry[0];
      return input.value.trim() === "" || !Number.isInteger(Number(input.value)) || Number(input.value) < 0 || Number(input.value) > entry[1];
    });
    if (invalidInput) {
      elements["form-error"].textContent = "Enter whole numbers within the limits shown for each time unit.";
      invalidInput[0].focus();
      return;
    }
    var durationMs = (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;
    if (durationMs === 0) {
      elements["form-error"].textContent = "Set a duration greater than zero to start the countdown.";
      elements["duration-seconds"].focus();
      return;
    }
    stopAudio();
    timer.title = elements["timer-title"].value.trim() || "Game Night";
    timer.durationMs = durationMs;
    timer.remainingMs = durationMs;
    timer.endAt = Date.now() + durationMs;
    timer.paused = false;
    timer.finished = false;
    timer.sound = elements["alert-sound"].value;
    elements["form-error"].textContent = "";
    elements["countdown-title"].textContent = timer.title;
    elements["timer-status"].textContent = "Counting down";
    elements["timer-screen"].classList.remove("is-finished");
    elements["pause-resume"].hidden = false;
    elements["pause-resume"].textContent = "Pause";
    elements["stop-alert"].hidden = true;
    elements["setup-screen"].hidden = true;
    elements["timer-screen"].hidden = false;
    tick();
    if (!timer.finished) tickInterval = window.setInterval(tick, 100);
  }

  function togglePause() {
    if (timer.finished) return;
    if (!timer.paused) {
      timer.remainingMs = Math.max(0, timer.endAt - Date.now());
      timer.paused = true;
      window.clearInterval(tickInterval);
      tickInterval = null;
      elements["pause-resume"].textContent = "Resume";
      elements["timer-status"].textContent = "Paused";
      renderTime(timer.remainingMs);
      return;
    }
    if (timer.remainingMs <= 0) {
      finishCountdown();
      return;
    }
    timer.endAt = Date.now() + timer.remainingMs;
    timer.paused = false;
    elements["pause-resume"].textContent = "Pause";
    elements["timer-status"].textContent = "Counting down";
    tick();
    tickInterval = window.setInterval(tick, 100);
  }

  function resetCountdown() {
    window.clearInterval(tickInterval);
    tickInterval = null;
    stopAudio();
    timer.paused = false;
    timer.finished = false;
    timer.remainingMs = timer.durationMs;
    elements["timer-screen"].classList.remove("is-finished");
    elements["timer-screen"].hidden = true;
    elements["setup-screen"].hidden = false;
    elements["timer-status"].textContent = "Counting down";
    elements["pause-resume"].hidden = false;
    elements["pause-resume"].textContent = "Pause";
    elements["stop-alert"].hidden = true;
    document.title = "Neon Countdown";
  }

  function updateVolume() {
    elements["volume-value"].textContent = elements.volume.value + "%";
    if (currentAudio) currentAudio.volume = Number(elements.volume.value) / 100;
  }

  function saveUploadedTrack(file) {
    var id = "track-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    return withTrackStore("readwrite", function (store) {
      return store.put({ id: id, name: file.name, blob: file });
    }).then(function () {
      var track = { id: id, name: file.name };
      addTrackOption(track);
      elements["alert-sound"].value = "track:" + id;
      elements["upload-name"].textContent = file.name;
      return id;
    });
  }

  function handleUpload() {
    var file = elements["audio-upload"].files[0];
    if (!file) return;
    if (!file.type || !file.type.startsWith("audio/")) {
      elements["form-error"].textContent = "Choose a valid audio file.";
      elements["audio-upload"].value = "";
      return;
    }
    elements["form-error"].textContent = "";
    elements["upload-name"].textContent = "Saving track...";
    saveUploadedTrack(file).catch(function (error) {
      elements["upload-name"].textContent = "No track selected";
      elements["form-error"].textContent = "Could not save this track on your device: " + error.message;
      console.error("Unable to save uploaded audio.", error);
    });
  }

  function handleSoundSelection() {
    var value = elements["alert-sound"].value;
    if (value.indexOf("track:") === 0) {
      var option = elements["alert-sound"].selectedOptions[0];
      elements["upload-name"].textContent = option ? option.textContent : "Saved track";
    } else {
      elements["upload-name"].textContent = "No track selected";
    }
  }

  function bindEvents() {
    elements["countdown-form"].addEventListener("submit", function (event) {
      event.preventDefault();
      startCountdown();
    });
    elements["pause-resume"].addEventListener("click", togglePause);
    elements["reset-timer"].addEventListener("click", resetCountdown);
    elements["stop-alert"].addEventListener("click", function () {
      stopAudio();
      elements["stop-alert"].hidden = true;
      elements["timer-status"].textContent = "Time is up!";
    });
    elements["volume"].addEventListener("input", updateVolume);
    elements["audio-upload"].addEventListener("change", handleUpload);
    elements["alert-sound"].addEventListener("change", handleSoundSelection);
    elements["preview-sound"].addEventListener("click", function () {
      playSelectedSound(true).catch(function (error) {
        elements["form-error"].textContent = "Preview could not play: " + error.message;
        console.error("Unable to preview alert sound.", error);
      });
    });
  }

  function init() {
    cacheElements();
    bindEvents();
    loadTracks().catch(function (error) {
      elements["form-error"].textContent = "Saved tracks could not be loaded: " + error.message;
      console.error("Unable to restore uploaded audio.", error);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
}());
