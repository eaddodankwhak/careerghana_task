"""Print one randomly selected career tip or motivational quote."""

from datetime import date
import random
import textwrap


# Keep all tips in one list so every run can choose from either category.
# Quotes with a named author store the quote and author separately.
TIPS = [
    {
        "text": "Every expert at anything was once a beginner. Embrace the journey!",
        "author": "Helen Hayes",
        "category": "Encouragement",
    },
    {
        "text": "Failure is not the opposite of success; it's a stepping stone and part of success.",
        "author": "Arianna Huffington",
        "category": "Encouragement",
    },
    {
        "text": "Stay afraid, but do it anyway. The confidence will follow your actions.",
        "author": "Carrie Fisher",
        "category": "Encouragement",
    },
    {
        "text": "The journey of a thousand miles begins with a single step. Celebrate your small steps today!",
        "author": "Lao Tzu",
        "category": "Encouragement",
    },
    {
        "text": "You are doing much better than you realize—take a deep breath and trust your progress.",
        "author": None,
        "category": "Encouragement",
    },
    {
        "text": "Even on the toughest days, your willingness to show up and learn is your superpower.",
        "author": None,
        "category": "Encouragement",
    },
    {
        "text": "It's entirely okay to take things one day at a time. Steady progress is still progress.",
        "author": None,
        "category": "Encouragement",
    },
    {
        "text": "Every challenge you navigate right now is actively shaping you into a stronger professional.",
        "author": None,
        "category": "Encouragement",
    },
    {
        "text": "If opportunity doesn't knock, build a door.",
        "author": "Milton Berle",
        "category": "Encouragement",
    },
    {
        "text": "Don't let the fear of striking out keep you from playing the game.",
        "author": "Babe Ruth",
        "category": "Encouragement",
    },
    {
        "text": "Your career is a marathon, not a sprint. Pace yourself and focus on continuous learning.",
        "author": None,
        "category": "Practical Advice",
    },
    {
        "text": "Don't be afraid to speak up in meetings. Your perspective is valuable and unique.",
        "author": None,
        "category": "Practical Advice",
    },
    {
        "text": "Networking isn't just about collecting contacts; it's about planting relationships.",
        "author": None,
        "category": "Practical Advice",
    },
    {
        "text": "Constructive criticism is a gift. Use it to build better habits and skills.",
        "author": None,
        "category": "Practical Advice",
    },
    {
        "text": "Set clear, actionable boundaries to maintain a healthy work-life balance.",
        "author": None,
        "category": "Practical Advice",
    },
    {
        "text": "Be a problem solver, not just a problem finder. Bring solutions to your team.",
        "author": None,
        "category": "Practical Advice",
    },
    {
        "text": "Your reputation is your most valuable currency. Keep your word and deliver quality.",
        "author": None,
        "category": "Practical Advice",
    },
    {
        "text": "Never stop updating your skills; technology and industries change faster than ever.",
        "author": None,
        "category": "Practical Advice",
    },
    {
        "text": "Take time to document your achievements weekly. It makes performance reviews much easier.",
        "author": None,
        "category": "Practical Advice",
    },
    {
        "text": "Consistency always beats intensity in the long run. Keep showing up.",
        "author": None,
        "category": "Practical Advice",
    },
]


def format_tip(tip: dict[str, str | None], width: int = 68) -> str:
    """Return a neat text box, wrapping longer tips to fit the border."""
    lines = [
        "DAILY CAREER COACH",
        date.today().strftime("%A, %B %d, %Y"),
        f"Category: {tip['category']}",
        "",
        *textwrap.wrap(tip["text"] or "", width=width - 4),
    ]
    if tip["author"]:
        lines.extend(["", f"— {tip['author']}"])

    border = "+" + "-" * (width - 2) + "+"
    boxed_lines = [f"| {line:<{width - 4}} |" for line in lines]
    return "\n".join([border, *boxed_lines, border])


def main() -> None:
    """Choose a tip from the full mixed list and print it."""
    print(format_tip(random.choice(TIPS)))


if __name__ == "__main__":
    main()
