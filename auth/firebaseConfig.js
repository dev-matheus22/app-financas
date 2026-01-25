import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQnv3K1Ppun7ixkB1wfUeG7y5EEmoJPFQ",
  authDomain: "app-financas-bf1dd.firebaseapp.com",
  projectId: "app-financas-bf1dd",
  storageBucket: "app-financas-bf1dd.firebasestorage.app",
  messagingSenderId: "388960572923",
  appId: "1:388960572923:web:ca8d68eeba328c7690275e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);