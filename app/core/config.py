import os

import dotenv

_ = dotenv.load_dotenv()


class Settings:
    admin_password = os.getenv("ADMIN_PASSWORD")
    page_title = "Nachos"
    page_icon = "🌮"
    layout = "wide"
    mapbox_token = os.getenv("MAPBOX_TOKEN")
    mapbox_style = "mapbox://styles/liammorriskpmg/cm3try6w4006901sr253scyvq"
