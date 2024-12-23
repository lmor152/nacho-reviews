import pandas as pd
import plotly.express as px
import streamlit as st

from app.database import NachosDB
from app.visuals.map import make_map

db = NachosDB()
df = db.get_approved_reviews()

with st.sidebar:
    with st.expander("Filters", expanded=True):
        reviewer = st.selectbox("Reviewer", ["All", *df["reviewer"].unique()])


# apply filters
if reviewer != "All":
    df = df[df["reviewer"] == reviewer]


col1, col2 = st.columns(2)

with col1:
    subcol1, subcol2 = st.columns(2)

    with subcol1:
        st.metric("Total Reviews", len(df), border=True)
        st.metric("Total Spent", f"${df['price'].sum():.2f}", border=True)
        st.metric("Cheapest Dish", f"${df['price'].min():.2f}", border=True)
    with subcol2:
        st.metric(
            "Average Overall Score", f"{df['overall_score'].mean():.1f}/10", border=True
        )
        st.metric("Average Price", f"${df['price'].mean():.2f}", border=True)
        st.metric("Most Expensive Dish", f"${df['price'].max():.2f}", border=True)


with col2:
    # Display metrics
    grouped = df.groupby("name").agg("overall_score").mean().reset_index()

    st.dataframe(
        grouped.sort_values("overall_score", ascending=False),
        column_order=("name", "overall_score"),
        hide_index=True,
        width=None,
        use_container_width=True,
        column_config={
            "name": st.column_config.TextColumn(
                "Restaurant",
            ),
            "overall_score": st.column_config.ProgressColumn(
                "Average Overall Score",
                format="%f",
                min_value=0,
                max_value=10,
            ),
        },
    )


col3, col4 = st.columns(2)

with col3:
    fig_scores = px.box(
        df,
        y=["quantity_score", "taste_score", "atmosphere_score", "overall_score"],
        title="Score Distributions",
        labels={
            "variable": "",
            "value": "",
        },
    )

    fig_scores.update_xaxes(
        showgrid=False,
        zeroline=False,
        tickvals=[0, 1, 2, 3],
        ticktext=["Quantity", "Taste", "Atmosphere", "Overall"],
    )
    st.plotly_chart(fig_scores, use_container_width=True)

with col4:
    fig_map = make_map(df)
    st.plotly_chart(fig_map, use_container_width=True)


# add heatmap here
days = range(7)
weeks = range(0, 53)

complete_grid = pd.MultiIndex.from_product(
    [weeks, days], names=["weeks_ago", "day_of_week"]
).to_frame(index=False)

df["weeks_ago"] = (pd.to_datetime("today") - pd.to_datetime(df["date"])).dt.days // 7
filtered = df[df["weeks_ago"] <= 52]
filtered["day_of_week"] = pd.to_datetime(filtered["date"]).dt.dayofweek

grouped = filtered.groupby(["weeks_ago", "day_of_week"]).size().reset_index()

st.markdown(f"**{len(filtered)} reviews in the last year**")

df_heatmap = complete_grid.merge(
    grouped, on=["weeks_ago", "day_of_week"], how="left"
).fillna(0)


def set_emoji(x):
    if x == 0:
        return "⬜️"
    else:
        return "🟨"


df_heatmap["emoji_column"] = df_heatmap[0].apply(set_emoji)

df_heatmap.columns = ["weeks_ago", "day_of_week", "count", "emoji_column"]

fig_heatmap = px.scatter(
    df_heatmap,
    x="weeks_ago",
    y="day_of_week",
    text="emoji_column",
    labels={"weeks_ago": "", "day_of_week": ""},
    hover_data={x: False for x in df_heatmap.columns},
)

fig_heatmap.update_traces(
    marker=dict(size=0, opacity=0),
    textfont=dict(size=18),
)

xtick_vals = [1, 10, 20, 30, 40, 50]

# get what month it was at each tick
xtick_text = [pd.to_datetime("today") - pd.DateOffset(weeks=x) for x in xtick_vals]
xtick_text = [x.strftime("%B") for x in xtick_text]

fig_heatmap.update_xaxes(
    showgrid=False,
    zeroline=False,
    range=[53, -1],
    tickvals=xtick_vals,
    ticktext=xtick_text,
)
fig_heatmap.update_yaxes(
    showgrid=False,
    zeroline=False,
    range=[-1, 7],
    tickvals=[0, 1, 2, 3, 4, 5, 6],
    ticktext=[
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ],
)

fig_heatmap.update_layout(
    margin=dict(l=0, r=0, t=0, b=0),  # Adjust margins
    # padding=dict(l=0, r=0, t=0, b=0),  # Adjust padding
    height=300,
)

st.plotly_chart(
    fig_heatmap, use_container_width=False, config={"displayModeBar": False}
)
