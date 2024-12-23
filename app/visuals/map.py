import pandas as pd
from plotly import express as px


def make_map(df: pd.DataFrame):
    fig = px.scatter_map(
        df,
        lat="latitude",
        lon="longitude",
        size_max=15,
        size="overall_score",
        hover_data={
            "name": True,
            "reviewer": True,
            "overall_score": True,
            "latitude": False,
            "longitude": False,
        },
    )

    fig.update_traces(marker_color="orange")
    fig.update_layout(
        title="Review Locations",
    )

    return fig
