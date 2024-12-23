# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.12-slim

# Set the working directory.
WORKDIR /nachos

# Copy the requirements file into the container.
COPY . .

# Install the dependencies.
RUN pip install --no-cache-dir -r app/requirements.txt

# Expose the port Streamlit runs on.
EXPOSE 8080

ENV PYTHONPATH=/nachos

# Run the Streamlit application.
CMD ["streamlit", "run", "app/Home.py", "--server.port=8080", "--server.address=0.0.0.0"]