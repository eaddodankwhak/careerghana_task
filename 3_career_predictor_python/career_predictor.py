"""Train and use a small decision-tree career profile predictor."""

from pathlib import Path

import pandas as pd
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier


DATA_FILE = Path(__file__).with_name("career_data.csv")
PROFILES = ["Tech", "Business", "Creative", "Social"]

# Each exact column name is paired with its question for the command line.
QUESTIONS = [
    ("tech_score", "I enjoy playing around with apps, coding, or figuring out how gadgets work."),
    ("logic_score", "I like solving puzzles, brain teasers, or working with numbers and charts."),
    ("leader_score", "I feel comfortable taking charge of group projects or planning events."),
    ("speech_score", "I am good at presenting my ideas clearly or persuading people to agree with me."),
    ("art_score", "I love drawing, designing layouts, making music, or editing videos."),
    ("writing_score", "I enjoy writing essays, creating stories, or blogging about things I like."),
    ("help_score", "I get a lot of satisfaction from teaching, coaching, or volunteering to help people."),
    ("team_score", "I prefer working in a team with friends over doing a project completely alone."),
    ("organize_score", "I like keeping my schedule, school notes, or bedroom clean and organized."),
    ("risk_score", "I like trying new things and starting my own projects, even if I might fail."),
]
FEATURE_COLUMNS = [column for column, _ in QUESTIONS]


def train_model():
    """Train a decision tree and return it with its test-set evaluation."""
    data = pd.read_csv(DATA_FILE)
    features = data[FEATURE_COLUMNS]
    targets = data["career_category"]
    x_train, x_test, y_train, y_test = train_test_split(
        features,
        targets,
        test_size=0.25,
        random_state=42,
        stratify=targets,
    )

    # Limit tree depth so this small teaching example does not memorize every row.
    model = DecisionTreeClassifier(
        max_depth=4,
        min_samples_leaf=2,
        random_state=42,
    )
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)
    accuracy = accuracy_score(y_test, predictions)
    report = classification_report(
        y_test,
        predictions,
        labels=PROFILES,
        zero_division=0,
    )
    return model, accuracy, report


def ask_for_ratings():
    """Ask all ten questions and return a dictionary of whole-number ratings."""
    ratings = {}
    print("\nRate how much you agree with each statement from 1 to 5.")
    print("1 = strongly disagree; 5 = strongly agree.")

    for column, statement in QUESTIONS:
        while True:
            answer = input(f"\n{statement}\nYour rating (1-5): ").strip()
            try:
                rating = int(answer)
            except ValueError:
                print("Please enter a whole number from 1 to 5.")
                continue
            if 1 <= rating <= 5:
                ratings[column] = rating
                break
            print("Please enter a whole number from 1 to 5.")
    return ratings


def predict_profile(model, ratings):
    """Return the predicted profile and confidence percentages for each one."""
    new_person = pd.DataFrame([ratings], columns=FEATURE_COLUMNS)
    prediction = model.predict(new_person)[0]
    raw_probabilities = model.predict_proba(new_person)[0]
    confidence = {
        profile: 0.0
        for profile in PROFILES
    }
    for profile, probability in zip(model.classes_, raw_probabilities):
        confidence[profile] = float(probability) * 100
    return prediction, confidence


def main():
    """Show model evaluation, gather ratings, and print a prediction."""
    model, accuracy, report = train_model()
    print("Career predictor trained with a decision tree.")
    print(f"Test accuracy: {accuracy:.0%}")
    print("Classification report:")
    print(report)

    ratings = ask_for_ratings()
    prediction, confidence = predict_profile(model, ratings)
    print(f"\nPredicted career category: {prediction}")
    print("Model confidence for each profile:")
    for profile in PROFILES:
        print(f"  {profile}: {confidence[profile]:.1f}%")
    print("\nThis is a learning project, not professional career advice.")


if __name__ == "__main__":
    main()
