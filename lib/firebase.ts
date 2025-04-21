// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBR_rN6H9d483JiM2Wo0NeaSzZO2Fom5P4",
  authDomain: "checked-off-ce7fc.firebaseapp.com",
  projectId: "checked-off-ce7fc",
  storageBucket: "checked-off-ce7fc.appspot.com", // ✅ Corrected domain
  messagingSenderId: "730259855772",
  appId: "1:730259855772:web:5fdb19453a5543d2a5d059"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and GitHub provider
const auth = getAuth(app);
const githubProvider = new GithubAuthProvider();

export { auth, githubProvider };
