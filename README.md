# Welcome to BudgetBuddy 👋

This is a project created with React Native frontend and Flask backend running on 2 different servers. Backend is currently running on Render.
This project can be tested through the internet.
<a href ="https://docs.google.com/document/d/1NUjCQ-YFUp2MqdnXLQ5tkwcLuIX0_wzYd3lGwBkgnOY/edit?usp=drive_link"> Click here for more information </a>

Testing the app using Expo Go:
<div align="center">
   <img width="328" height="333" alt="Screenshot 2025-08-11 191804" src="https://github.com/user-attachments/assets/3fda5fd4-88ca-4dbc-ae35-0b3ba1ceaed3" />
</div>
## Get started

1. Create an .env file as the example file

2. Configure backend on your local machine, in the 1st terminal
   ```bash
   cd backend
   pip install -r requirements.txt
   python init_db.py
   python run.py
   ```
3. Change the BASE_API in BudgetBuddy/constants/api.js to your Flask 2nd ip

4. Configure frontend on your local machine, in the 2nd terminal
   ```bash
   cd BudgetBuddy
   npm install
   npx expo start
   ```
