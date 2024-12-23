import os

import dotenv

_ = dotenv.load_dotenv()


class Settings:
    admin_password = os.getenv("ADMIN_PASSWORD")
    page_title = "Nachos"
    page_icon = "🌮"
    layout = "wide"
