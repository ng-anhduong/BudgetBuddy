# Welcome to BudgetBuddy 👋

This is a project created with React Native frontend and Flask backend running on 2 different servers. Backend is currently running on Render.
This project can be tested through the internet.
<a href ="https://docs.google.com/document/d/1CAI5PpDt-ZQlI6et1LIvM2t7ppMq_3EUZiu3UqgLrbA/edit?usp=sharing"> Click here for more information </a>

## Preview of the app using Expo Go:
1. Install Expo Go from Play Store or Apple Store
2. Scan the QR code or type in the url:

   <a>exp://u.expo.dev/d61f0738-97c8-4d32-99cc-e11bf900a168/group/b4fed26f-dd25-4d9d-b349-3f2d03416da2</a>
   
<div align="center">
   <img width="462" height="458" alt="image" src="https://github.com/user-attachments/assets/65177947-3a7e-4929-82e5-d3712407b24f" />
</div>

## How to run it locally

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
