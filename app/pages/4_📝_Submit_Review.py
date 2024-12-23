import datetime
import uuid

import streamlit as st

from app.database import NachosDB, get_place_candidates

st.set_page_config(
    page_title="Nachos",
    page_icon="🌮",
    layout="wide",
)

# Initialize database
db = NachosDB()

st.title("📝 Submit a Nacho Review")


existing_reviewer = st.pills("Have you submitted a review before?", ["Yes", "No"])


def get_reviewer_list():
    reviewers = set()
    approved = db.get_approved_reviews()
    if len(approved) > 0:
        reviewers |= set(approved["reviewer"])

    pending = db.get_pending_reviews()
    if len(pending) > 0:
        reviewers |= set(pending["reviewer"])

    return reviewers


all_reviewers = get_reviewer_list()


def validate_review_form(review_data):
    if not review_data["name"]:
        return "Please enter a restaurant name"

    if not review_data["meal"]:
        return "Please enter a meal name"

    if not review_data["meal_description"]:
        return "Please enter a meal description"

    if not review_data["price"]:
        return "Please enter a price"

    if review_data["reviewer"] in all_reviewers and existing_reviewer == "No":
        return "Reviewer name already exists. Please enter a different name."

    return None


@st.dialog("Select the correct place:")
def select_candidate(candidates):
    if len(candidates) == 0:
        st.warning(
            "No places found with that name. Please enter the one from Google Maps."
        )
        st.stop()

    chosen = st.radio(
        "We found these on Google Maps:",
        [
            f"{i+1}. {c['displayName']['text']} ({c['formattedAddress']})"
            for i, c in enumerate(candidates)
        ],
    )

    chosen_index = int(chosen.split(".")[0]) - 1

    if st.button("Submit"):
        st.session_state.google_place = candidates[chosen_index]
        st.rerun()


if existing_reviewer is not None:
    if "google_place" not in st.session_state:
        if existing_reviewer == "No":
            st.info(
                "Make sure you have read the Scoring Guide before submitting a review",
                icon=":material/warning:",
            )

        with st.form("review_form", clear_on_submit=False):
            if existing_reviewer == "No":
                reviewer = st.text_input("Your Name")
            else:
                reviewer = st.selectbox("Your Name", all_reviewers)

            col1, col2, col3 = st.columns(3)

            with col1:
                name = st.text_input("Restaurant Name")

            with col2:
                meal = st.text_input("Meal Name")

            with col3:
                date = st.date_input("Date", datetime.datetime.now())

            meal_description = st.text_area("Meal Description")
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
                    "date": date.isoformat(),
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

                validation_error = validate_review_form(review_data)

                if validation_error:
                    st.toast(validation_error, icon=":material/error:")
                    st.stop()

                place_candidates = get_place_candidates(name)
                st.session_state.review_data = review_data
                select_candidate(place_candidates)

    else:
        # get the form data
        review_data = st.session_state.review_data
        review_data["name"] = st.session_state.google_place["displayName"]["text"]
        review_data["longitude"] = st.session_state.google_place["location"][
            "longitude"
        ]
        review_data["latitude"] = st.session_state.google_place["location"]["latitude"]
        review_data["review_id"] = str(uuid.uuid4())[:8]

        # clear the users state so they can submit another review
        del st.session_state.review_data
        del st.session_state.google_place

        # add the review to the database
        db.add_pending_review(review_data)

        st.toast("Review submitted successfully!", icon=":material/check:")
        st.balloons()
