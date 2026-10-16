"""Ask about work interests and suggest matching career profiles."""

# Each question has the exact four answer choices requested. The answer letter
# maps to the same profile for every question.
QUESTIONS = [
    (
        "How do you like to solve a tough problem?",
        (
            "Use logic, data, or math to figure it out.",
            "Make a plan, manage time, and lead others.",
            "Brainstorm unique, creative ideas or drawings.",
            "Talk to people and find a friendly solution.",
        ),
    ),
    (
        "What sounds like a fun school project?",
        (
            "Building a website, an app, or a robot.",
            "Running a mock business or selling a product.",
            "Designing posters, editing videos, or creating art.",
            "Organizing a charity event to help the community.",
        ),
    ),
    (
        "When starting a completely blank project, you:",
        (
            "Look for clear rules, formulas, or instructions.",
            "Create a step-by-step schedule to finish it.",
            "Start experimenting freely with colors and ideas.",
            "Ask friends to join so you can work together.",
        ),
    ),
    (
        "What is your usual role in group work?",
        (
            "The builder who handles the technical parts.",
            "The leader who assigns tasks to everyone.",
            "The creator who brings original ideas.",
            "The helper who keeps the team happy.",
        ),
    ),
    (
        "How do you convince someone to agree with you?",
        (
            "Show them facts, charts, or solid proof.",
            "Speak confidently and explain the big benefits.",
            "Tell an interesting story or show them visuals.",
            "Listen carefully to how they feel first.",
        ),
    ),
    (
        "Where do you study or work best?",
        (
            "A quiet room where I can focus deeply.",
            "A busy, fast-paced room with lots happening.",
            "A creative studio with total design freedom.",
            "A friendly space surrounded by helpful people.",
        ),
    ),
    (
        "How do you unwind after a long school day?",
        (
            "Play video games or solve strategy puzzles.",
            "Go out with friends or plan future goals.",
            "Draw, listen to music, or read stories.",
            "Have a long chat with a close friend.",
        ),
    ),
    (
        "How do you handle a tight project deadline?",
        (
            "Use calendar apps to track my time perfectly.",
            "Work faster and push others to finish too.",
            "Wait until the last minute for a creative spark.",
            "Keep everyone calm so nobody gets stressed.",
        ),
    ),
    (
        "How do you prefer to learn a new skill?",
        (
            "Read instructions and see how the system works.",
            "Figure out how it can help me succeed later.",
            "Try it out immediately and learn from mistakes.",
            "Learn with a study group or a mentor.",
        ),
    ),
    (
        "What is most important to you in a future job?",
        (
            "Building cool technology and solving problems.",
            "Earning well, growing fast, and leading teams.",
            "Expressing myself freely through arts and media.",
            "Making a positive difference in people's lives.",
        ),
    ),
]

PROFILES = {
    "Tech": {
        "description": "You enjoy solving problems with technology and building efficient solutions.",
        "jobs": ["Software developer", "IT support specialist", "Cybersecurity analyst"],
    },
    "Business": {
        "description": "You enjoy setting goals, organizing resources, and guiding teams toward results.",
        "jobs": ["Project manager", "Business analyst", "Marketing manager"],
    },
    "Creative": {
        "description": "You enjoy expressing ideas and creating engaging visual or written work.",
        "jobs": ["Graphic designer", "UX designer", "Art director"],
    },
    "Social": {
        "description": "You enjoy listening, supporting others, and helping people and communities thrive.",
        "jobs": ["Teacher", "Social worker", "Career counselor"],
    },
}

# Keep the mapping in one place so every question awards the intended profile.
ANSWER_PROFILES = {
    "A": "Tech",
    "B": "Business",
    "C": "Creative",
    "D": "Social",
}


def ask_question(number, question, options):
    """Display a question and return a valid uppercase answer letter."""
    print(f"\nQuestion {number} of {len(QUESTIONS)}")
    print(question)
    for letter, option in zip(ANSWER_PROFILES, options):
        print(f"{letter}. {option}")

    while True:
        answer = input("Choose A, B, C, or D: ").strip().upper()
        if answer in ANSWER_PROFILES:
            return answer
        print("Invalid choice. Please enter A, B, C, or D.")


def calculate_scores(answers):
    """Return a score dictionary, adding one point for each answer."""
    scores = {profile: 0 for profile in PROFILES}
    for answer in answers:
        scores[ANSWER_PROFILES[answer]] += 1
    return scores


def show_results(scores):
    """Print the top profile(s), runner-up profile(s), and all scores."""
    highest_score = max(scores.values())
    top_profiles = [
        profile for profile, score in scores.items() if score == highest_score
    ]

    print("\n" + "=" * 55)
    print("YOUR CAREER QUIZ RESULTS")
    print("=" * 55)

    if len(top_profiles) > 1:
        print("It's a tie between: " + " and ".join(top_profiles))
    else:
        print(f"Recommended career path: {top_profiles[0]}")

    for profile in top_profiles:
        details = PROFILES[profile]
        print(f"\n{profile}: {details['description']}")
        print("Example jobs: " + ", ".join(details["jobs"]))

    remaining_profiles = [
        (profile, score)
        for profile, score in scores.items()
        if profile not in top_profiles
    ]
    if remaining_profiles:
        runner_up_score = max(score for _, score in remaining_profiles)
        runner_up_profiles = [
            profile
            for profile, score in remaining_profiles
            if score == runner_up_score
        ]
        if len(runner_up_profiles) > 1:
            print(
                "\nRunner-up tie: "
                + ", ".join(runner_up_profiles)
                + f" ({runner_up_score} point(s) each)"
            )
        else:
            print(
                f"\nRunner-up: {runner_up_profiles[0]} "
                f"({runner_up_score} point(s))"
            )
    else:
        print("\nThere is no separate runner-up profile.")

    print("\nFull score breakdown:")
    for profile, score in scores.items():
        print(f"  {profile}: {score}")
    print("\nUse this result as a starting point for exploring careers.")


def main():
    """Run the quiz from the first question through the final results."""
    answers = []
    for number, (question, options) in enumerate(QUESTIONS, start=1):
        answers.append(ask_question(number, question, options))

    show_results(calculate_scores(answers))


if __name__ == "__main__":
    main()
