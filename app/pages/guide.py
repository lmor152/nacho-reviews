import streamlit as st
from dotenv import load_dotenv

_ = load_dotenv()


st.title("📈 Scoring Guide")

score_definitons = """
| Score Category | Score Description |
|----------------|-------------------|
| Taste       | How nice was the meal, how well did the flavours merge, etc. |
| Quantity    | How big was the meal, would it feed a child or a horse? |
| Atmosphere  | How fun/nice was the place, did it have good vibes? |
| Overall     | Weigh up all of the other scores and value-for-money for a total rating |
"""

st.header("What does each score category refer to?")
st.markdown(
    "There are a few categores for scores to cover most aspects of a nacho meal. These are the categories used and what they mean:"
)
st.markdown(score_definitons)


score_matrix = """
| Score Group | Taste | Quantity | Atmosphere | Overall |
|-------------|-------|----------|------------|---------|
| 1-3         | I left some parts on the plate. | I need to order two or three of these to feel full. | I couldn't wait to leave. | Dealbreaker, I wouldn't come back here. |
| 4-6         | Average, nothing special. | An average sized meal, I could eat more but don't need to. | It was fine, nothing special. | I would come back here if it was convenient. |
| 7-8         | Tastes great, I'm satisfied with the meal. | I'm stuffed, but could maybe make room for dessert. | I enjoyed the atmosphere. | A destination restaurant, I would recommend to friends. |
| 9-10        | Fantastic! I'm going to be a regular here for the rest of my life. | Absurd amount of food, I'm taking some home. | Rooftop dining with a view of the city, I never want to leave. | This place is perfect, I'm moving in upstairs. |
"""
st.header("What do the scores mean?")
st.markdown(
    "Scoring a 1 is pretty bad, 10 is perfect, and 5 is average. Here's a breakdown of how to interpret each score:"
)
st.markdown(score_matrix)
