import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBbkCm8B70Qi2aPMuL-YKZEZc7_ieAqwH0",
  authDomain: "nordisk-management.firebaseapp.com",
  projectId: "nordisk-management",
  storageBucket: "nordisk-management.firebasestorage.app",
  messagingSenderId: "601807263512",
  appId: "1:601807263512:web:1ae00c6b549c67fe8c706d",
  measurementId: "G-C7R3BKE0LD",
};

const fsApp = initializeApp(firebaseConfig);

export default fsApp;
