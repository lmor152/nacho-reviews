import os

import streamlit as st
from dotenv import load_dotenv

from app.database import NachosDB

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
st.session_state["password"] = password

if st.session_state["password"] == os.environ["ADMIN_PASSWORD"]:
    pending_reviews = db.get_pending_reviews()

    if pending_reviews.empty:
        st.info("No pending reviews")
    else:
        for _, review in pending_reviews.iterrows():
            with st.expander(
                f"Review for {review['name']} by {review['reviewer']} ({review['review_id']})"
            ):
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

                col1, col2, *other_cols = st.columns(7)
                with col1:
                    if st.button(
                        "👍 Approve Review", key="approve_" + review["review_id"]
                    ):
                        db.approve_review(review["review_id"])
                        st.toast("Review approved!")
                        st.rerun()

                with col2:
                    if st.button(
                        "👎 Reject Review", key="reject_" + review["review_id"]
                    ):
                        db.reject_review(review["review_id"])
                        st.toast("Review removed")
                        st.rerun()
else:
    st.warning("Please enter the admin password to view this page")
