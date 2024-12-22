import pandas as pd
from core.config import Settings
from plotly import express as px

px.set_mapbox_access_token(Settings.mapbox_token)

def make_map(df: pd.DataFrame):
    fig_map = px.scatter_mapbox(
        df,
        lat="lat",
        lon="lng",
        hover_data={
            "name": True,
            "reviewer": True,
            "overall_score": True,
            "lat": False,
            "lng": False,
        },
        color="reviewer",
        height=500,
    )
    fig_map.update_layout(
        mapbox={
            "style": "faded",
            "accesstoken": Settings.mapbox_token,
        },
        margin={"r": 0, "t": 0, "l": 0, "b": 0},
        showlegend=False,
    )
    return fig_map
