# ProjectFlow — AI-Driven Project Management Tool

An intelligent project management system featuring an integrated AI assistant that allows you to manage workflows using natural language. This project was developed as part of a diploma thesis.

## 🌟 Key Features
- **AI Assistant:** Create, update, and decompose tasks through an interactive chat interface.
- **Project Tracking:** Visualize tasks, statuses, and priorities with ease.
- **Team Management:** Assign team members and monitor workload.
- **Real-time Sync:** Instant data synchronization powered by Firebase Firestore.

## 🚀 Setup Instructions

To run this project locally, you will need to set up your own Firebase and Gemini API services.

### 1. Firebase Configuration
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Firestore Database** and select **"Test Mode"** for the initial setup.
3. Under the **Authentication** section, enable the **"Email/Password"** sign-in method.
4. Register a new **"Web App"** in your project settings and copy the `firebaseConfig` object.

### 2. Gemini API Configuration
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Click on **"Get API key"** and create a new API Key.
3. Copy the token to use in your environment variables.

### 3. Installation and Launch
```bash
# Clone the repository
git clone [https://github.com/YuraSab/project-management-tools-diploma.git](https://github.com/YuraSab/project-management-tools-diploma.git)

# Navigate to the project directory
cd project-management-tools-diploma

# Install dependencies
npm install

# Environment Variables Setup
# Create a .env file in the root directory and add the following:
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
VITE_GEMINI_API_KEY="your_gemini_api_key"

# Run the project
npm run dev