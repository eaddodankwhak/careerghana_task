# Career Predictor (Standalone)

A small browser-only career quiz trained from the included `career_data.csv`.
It uses plain HTML, CSS, and JavaScript; no web server or network connection is
needed to take the quiz.

Run `python build_model.py` once if the data changes to regenerate `model.js`,
then just open `index.html` (for example, by double-clicking it in File
Explorer).

The quiz presents ten rating questions and displays a predicted profile, the
model confidence for Tech, Business, Creative, and Social, and held-out test
accuracy. The included 40 examples are imaginary and intended only for
learning. The result is not a formal career assessment or professional advice.
