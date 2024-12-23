import streamlit as st

from app.database import NachosDB

db = NachosDB()
df = db.get_approved_reviews()

df = df[
    [
        "name",
        "meal",
        "meal_description",
        "price",
        "reviewer",
        "quantity_score",
        "taste_score",
        "atmosphere_score",
        "overall_score",
        "comments",
        "date",
    ]
]
df = df.rename(
    columns={
        "quantity_score": "Quantity",
        "taste_score": "Taste",
        "atmosphere_score": "Atmosphere",
        "overall_score": "Overall",
        "price": "Price",
        "comments": "Comments",
        "reviewer": "Reviewer",
        "name": "Restaurant",
        "meal": "Meal",
        "meal_description": "Description",
        "date": "Date",
    },
)


st.dataframe(df, use_container_width=True, hide_index=True)
