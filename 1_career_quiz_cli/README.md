# Career Profile Quiz

This command-line quiz asks 10 questions about your interests, work style,
strengths, and career values. At the end, it recommends one or more matching
career profiles and shows example jobs.

## How to run it

1. Open a terminal in the `1_career_quiz_cli` folder.
2. Run the script with Python 3:

   ```powershell
   python career_quiz.py
   ```

3. Answer each question with A, B, C, or D. Lowercase letters also work. If
   you enter anything else, the quiz asks you to try that question again.

The script uses only Python's standard library, so no additional packages are
needed.

## How scoring works

Every answer adds one point to the profile associated with its letter:

| Answer | Profile |
| --- | --- |
| A | Tech |
| B | Business |
| C | Creative |
| D | Social |

The profile with the highest score is the recommendation. When multiple
profiles tie for the highest score, the quiz says so and shows each tied
profile with its explanation and three example jobs. It also shows the
runner-up profile (or runner-up tie) and the complete score breakdown.

## Example run

Fresh example output from a terminal run where I answered A to all 10
questions. In PowerShell, supply the answers with:

```powershell
$answers = @('A','A','A','A','A','A','A','A','A','A')
$answers | python .\career_quiz.py
```

The final output from that run is:

```text
=======================================================
YOUR CAREER QUIZ RESULTS
=======================================================
Recommended career path: Tech

Tech: You enjoy solving problems with technology and building efficient solutions.
Example jobs: Software developer, IT support specialist, Cybersecurity analyst

Runner-up tie: Business, Creative, Social (0 point(s) each)

Full score breakdown:
  Tech: 10
  Business: 0
  Creative: 0
  Social: 0

Use this result as a starting point for exploring careers.
```
