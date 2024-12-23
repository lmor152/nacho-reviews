import streamlit as st

st.set_page_config(
    page_title="Nachos",
    page_icon="🌮",
    layout="wide",
)

page = st.navigation(
    [
        st.Page("pages/home.py"),
        st.Page("pages/dashboard.py"),
        st.Page("pages/reviews.py"),
        st.Page("pages/admin.py"),
        st.Page("pages/guide.py"),
        st.Page("pages/submit.py"),
    ],
    position="hidden",
)

with st.sidebar:
    left_co, cent_co, last_co = st.columns([1, 2, 1], gap="small")
    with cent_co:
        st.image("nachos.svg", use_container_width=True)

    with st.expander("Navigation", expanded=True):
        st.page_link("pages/home.py", label="Home", icon="🏠")
        st.page_link("pages/dashboard.py", label="Dashboard", icon="📊")
        st.page_link("pages/reviews.py", label="Reviews", icon="✅")
        st.page_link("pages/guide.py", label="Score Guide", icon="📈")
        st.page_link("pages/submit.py", label="Submit Review", icon="📝")
        st.page_link("pages/admin.py", label="Admin", icon="🔒")


page.run()
