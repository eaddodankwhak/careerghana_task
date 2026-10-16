# How the career predictor works

The program starts with `career_data.csv`, a small collection of 40 imaginary
people. Each person has a rating from 1 to 5 for ten interests and skills, plus
one career category: Tech, Business, Creative, or Social. The examples are
balanced across the four categories, with a few ratings that overlap so the
profiles are not perfectly separate.

When you answer the questions, your ten ratings become the ten input values
for the model. The program uses a decision tree. Think of it as a series of
simple questions about ratings: for example, “Is this score above a certain
number?” The tree learns which combinations of answers often match each
category in the sample data.

Before making a prediction, the program sets aside some sample rows and tests
the tree on those rows. Its accuracy is the share of those test examples that
it labels correctly. The classification report gives a short breakdown of
how its predictions compare with the known labels for each profile. With the
included data and fixed split, the current test accuracy is 90%. The same
training and test split is used each time, so the displayed score is
reproducible.

For a new person, the model follows the learned questions using their ratings.
It prints the predicted category and the model's confidence percentages for
all four categories. These confidence values reflect how the model groups its
sample examples; they are not a scientific probability that a job will be a
good personal fit.

This project uses only 40 made-up examples. That is far too little information
to represent all people or careers, and a different small sample could produce
a different model. Use the result to explore possibilities, not as a final
decision or professional career assessment.
