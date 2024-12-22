import datetime

import streamlit as st
from database import NachosDB

st.set_page_config(
    page_title="Nachos",
    page_icon="🌮",
    layout="wide",
)

# Initialize database
db = NachosDB()

st.title("Submit a Nacho Review")

with st.form("review_form"):
    name = st.text_input("Restaurant Name")
    col1, col2 = st.columns(2)
    with col1:
        lat = st.number_input("Latitude", -90.0, 90.0, 0.0)
    with col2:
        lng = st.number_input("Longitude", -180.0, 180.0, 0.0)

    meal = st.text_input("Meal Name")
    meal_description = st.text_area("Meal Description")
    reviewer = st.text_input("Your Name")
    price = st.number_input("Price ($)", 0.0, 1000.0)

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        quantity_score = st.slider("Quantity Score", 1, 10)
    with col2:
        taste_score = st.slider("Taste Score", 1, 10)
    with col3:
        atmosphere_score = st.slider("Atmosphere Score", 1, 10)
    with col4:
        overall_score = st.slider("Overall Score", 1, 10)

    comments = st.text_area("Additional Comments")

    submitted = st.form_submit_button("Submit Review")

    if submitted:
        review_data = {
            "name": name,
            "lat": lat,
            "lng": lng,
            "date": datetime.datetime.now().strftime("%Y-%m-%d"),
            "meal": meal,
            "meal_description": meal_description,
            "reviewer": reviewer,
            "price": price,
            "quantity_score": quantity_score,
            "taste_score": taste_score,
            "atmosphere_score": atmosphere_score,
            "overall_score": overall_score,
            "comments": comments,
        }

        db.add_pending_review(review_data)
        st.success(
            "Review submitted successfully! It will be visible after admin approval."
        )
