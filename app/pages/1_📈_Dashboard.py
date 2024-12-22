import plotly.express as px
import streamlit as st
from database import NachosDB
from visuals.map import make_map

# Initialize database

db = NachosDB()
df = db.get_all_reviews()

st.set_page_config(
    page_title="Nachos",
    page_icon="🌮",
    layout="wide",
)

st.title("Nachos Reviews Dashboard")


with st.sidebar:
    st.title("Filters")
    reviewer = st.selectbox("Reviewer", ["All", *df["reviewer"].unique()])


# apply filters
if reviewer != "All":
    df = df[df["reviewer"] == reviewer]


# Display metrics
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric("Total Reviews", len(df))
with col2:
    st.metric("Average Price", f"${df['price'].mean():.2f}")
with col3:
    st.metric("Average Overall Score", f"{df['overall_score'].mean():.1f}/10")
with col4:
    st.metric(
        "Best Rated Place",
        df.loc[df["overall_score"].idxmax()]["name"] if not df.empty else "N/A",
    )

# Create charts
col1, col2 = st.columns(2, gap="large")

with col1:
    # Score distribution
    fig_scores = px.box(
        df,
        y=["quantity_score", "taste_score", "atmosphere_score", "overall_score"],
        title="Score Distribution",
    )
    st.plotly_chart(fig_scores, use_container_width=True)

    # Price vs Overall Score
    fig_price = px.scatter(
        df,
        x="price",
        y="overall_score",
        hover_data=["name"],
        title="Price vs Overall Score",
    )
    st.plotly_chart(fig_price, use_container_width=True)

with col2:
    # Average scores by restaurant
    avg_scores = (
        df.groupby("name")[["overall_score"]]
        .mean()
        .sort_values("overall_score", ascending=True)
    )
    fig_restaurants = px.bar(avg_scores, orientation="h", title="Restaurant Rankings")
    st.plotly_chart(fig_restaurants, use_container_width=True)

    # Timeline of reviews
    fig_map = make_map(df)
    st.plotly_chart(fig_map, use_container_width=True)
