# Career Predictor (Python)

A beginner-friendly command-line project that uses ten 1-to-5 ratings to
predict one of four career profiles: Tech, Business, Creative, or Social.
It trains a small decision tree from the included sample data, reports its
test-set accuracy, then asks for your ratings and shows confidence scores.

## Setup

Use Python 3. Install the packages from this folder:

```powershell
python -m pip install -r requirements.txt
```

## Run

From this folder, run:

```powershell
python career_predictor.py
```

Rate each statement from 1 (strongly disagree) to 5 (strongly agree). The
program asks again if a response is not a whole number in that range.

## Example run

The following output is from a real run with the sample data. The displayed
ratings use 5 for the first two statements and 3 for the remaining statements.
The fixed test split produced 90% accuracy for this run:

```text
Career predictor trained with a decision tree.
Test accuracy: 90%
Classification report:
              precision    recall  f1-score   support

        Tech       1.00      0.50      0.67         2
    Business       0.75      1.00      0.86         3
    Creative       1.00      1.00      1.00         2
      Social       1.00      1.00      1.00         3

    accuracy                           0.90        10
   macro avg       0.94      0.88      0.88        10
weighted avg       0.93      0.90      0.89        10

Rate how much you agree with each statement from 1 to 5.
1 = strongly disagree; 5 = strongly agree.

I enjoy playing around with apps, coding, or figuring out how gadgets work.
Your rating (1-5): 5

I like solving puzzles, brain teasers, or working with numbers and charts.
Your rating (1-5): 5
...
What is most important to you in a future job?
Your rating (1-5): 3

Predicted career category: Tech
Model confidence for each profile:
  Tech: 100.0%
  Business: 0.0%
  Creative: 0.0%
  Social: 0.0%

This is a learning project, not professional career advice.
```

The report and prediction are produced by the script. Test results are
specific to this small imaginary dataset and do not measure real-world career
fit.
