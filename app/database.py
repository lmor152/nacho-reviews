import json
import os

import pandas as pd
import requests
from google.cloud import firestore


class NachosDB:
    def __init__(self):
        self.client = firestore.Client()
        self.pending_collection = self.client.collection("pending_reviews")
        self.approved_collection = self.client.collection("approved_reviews")

    def add_pending_review(self, review_data):
        self.pending_collection.add(review_data, review_data["review_id"])

    def approve_review(self, review_id):
        review_data = self.pending_collection.document(review_id).get().to_dict()
        self.approved_collection.add(review_data, review_id)
        self.pending_collection.document(review_id).delete()

    def reject_review(self, review_id):
        self.pending_collection.document(review_id).delete()

    def get_approved_reviews(self):
        """Get all approved reviews as a pandas DataFrame"""
        df = pd.DataFrame([doc.to_dict() for doc in self.approved_collection.stream()])

        df["date"] = pd.to_datetime(df["date"]).dt.date
        return df

    def get_pending_reviews(self):
        """Get all pending reviews as a pandas DataFrame"""
        df = pd.DataFrame([doc.to_dict() for doc in self.pending_collection.stream()])

        if "date" in df.columns:
            df["date"] = pd.to_datetime(df["date"]).dt.date
        return df


def get_place_candidates(place_text):
    # Define the API endpoint
    url = "https://places.googleapis.com/v1/places:searchText"

    # Define the headers
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": os.environ["MAPS_API_KEY"],
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location",
    }

    # Define the data payload for the POST request
    data = {"textQuery": place_text, "maxResultCount": 5}

    # Make the POST request
    response = requests.post(url, headers=headers, json=data)

    # Check if the request was successful
    if response.status_code != 200:
        return []
    return json.loads(response.text)["places"]
