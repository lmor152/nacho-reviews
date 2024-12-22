import streamlit as st

st.set_page_config(
    page_title="Nachos",
    page_icon="🌮",
    layout="wide",
)

st.write("# Welcome to my Nachos app!")

col1, col2, col3 = st.columns(3)

with col1:
    st.page_link("pages/1_📈_Dashboard.py")

with col2:
    st.page_link("pages/2_📝_Submit_Review.py")

with col3:
    st.page_link("pages/3_🔒_Admin.py")
