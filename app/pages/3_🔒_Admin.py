import os

import streamlit as st
from database import NachosDB
from dotenv import load_dotenv

_ = load_dotenv()

st.set_page_config(
    page_title="Nachos",
    page_icon="🌮",
    layout="wide",
)

# Initialize database
db = NachosDB()

st.title("Admin Review Approval")

# Simple password protection
password = st.text_input("Enter admin password", type="password")
if password == os.environ["ADMIN_PASSWORD"]:
    pending_reviews = db.get_pending_reviews()

    if pending_reviews.empty:
        st.info("No pending reviews")
    else:
        for _, review in pending_reviews.iterrows():
            with st.expander(f"Review for {review['name']} by {review['reviewer']}"):
                col1, col2 = st.columns(2)
                with col1:
                    st.write(f"Restaurant: {review['name']}")
                    st.write(f"Meal: {review['meal']}")
                    st.write(f"Price: ${review['price']}")
                    st.write(f"Date: {review['date']}")
                with col2:
                    st.write(f"Quantity Score: {review['quantity_score']}")
                    st.write(f"Taste Score: {review['taste_score']}")
                    st.write(f"Atmosphere Score: {review['atmosphere_score']}")
                    st.write(f"Overall Score: {review['overall_score']}")

                st.write("Comments:", review["comments"])

                if st.button(f"Approve Review #{review['review_id']}"):
                    db.approve_review(review["review_id"])
                    st.success("Review approved!")
                    st.rerun()
else:
    st.warning("Please enter the admin password to view this page")
