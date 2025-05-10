Adama Project - Local Installation Guide

This guide explains how to run the Adama application locally on your system. The application has two main parts:

- Backend: A Flask API that loads the machine learning model and handles predictions.
- Frontend: An Ionic Angular app that provides the user interface.

---

 Prerequisites

Before you start, make sure the following are installed:

- Python 3.10+
- Node.js and npm
- Ionic CLI  
  Run the command below to install it:
  npm install -g @ionic/cli

---

 Step 1: Run the Backend (Flask API)

1. Open Command Prompt or Terminal.

2. Navigate to the model-api folder where model_api.py is located.  
   Example:
   cd C:\Users\YourName\Desktop\Adama\model-api

3. Create and activate a virtual environment:
   python -m venv venv
   venv\Scripts\activate       # For Windows

4. Install the required Python libraries:
   pip install flask flask-cors tensorflow Pillow

5. Run the backend API:
   python model_api.py

6. The backend will start on:
   http://localhost:5000

---

Step 2: Run the Frontend (Ionic Angular)

1. Open another Command Prompt or Terminal window.

2. Navigate to your project folder:
   cd C:\Users\YourName\Desktop\Adama

3. Install dependencies:
   npm install

4. Run the Ionic app:
   ionic serve

5. The app will open in your default browser, usually at:
   http://localhost:8100

---

Notes

- Make sure both terminals are running (backend and frontend).
- If you refresh the browser and get a "server not available" message, check that the Flask backend is still running.
- If you're using a different port or path in your backend, update the frontend API endpoint accordingly.

---

