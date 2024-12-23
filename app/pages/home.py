import streamlit as st

from app.database import NachosDB

db = NachosDB()
df = db.get_approved_reviews()

c1, c2, c3 = st.columns([1, 3, 1])

text = f"""
My favourite food is nachos, and I created this site to track all the places my friends and I have tried them. 

So far we have:
- **{len(df)}** reviews from **{df['reviewer'].nunique()}** reviewers
- **{df['meal'].nunique()}** different meals from **{df['name'].nunique()}** places
- Spent a total of **${df['price'].sum():.2f}** on nachos

Feel free to explore the site and add your own reviews! We have the following pages:
- **Home**: This page
- **Dashboard**: An overview of all the reviews
- **Reviews**: A list of all the reviews
- **Score Guide**: A guide to the scoring system
- **Submit Review**: Submit your own nacho review for approval - all reviews are matched to a location on Google Maps for consistency
- **Admin**: Where I can approve or reject pending reviews
"""

with c2:
    st.title("Welcome to my nachos site!")
    st.markdown(text)

with c1:
    st.image("random_nachos/random_nacho_4.png", use_container_width=True)
    st.image("random_nachos/random_nacho_2.svg", use_container_width=True)

with c3:
    st.image("random_nachos/random_nacho_3.png", use_container_width=True)
    st.image("random_nachos/random_nacho_5.png", use_container_width=True)
