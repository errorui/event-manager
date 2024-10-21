// Import the functions you need from the SDKs you need
import "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuratio
const firebaseConfig = {
  apiKey: "AIzaSyAG-jL3gV-aB6VKwVVTEzqMlrQa55ne8Gg",
  authDomain: "rproj-686e6.firebaseapp.com",
  projectId: "rproj-686e6",
  storageBucket: "rproj-686e6.appspot.com",
  messagingSenderId: "219118293660",
  appId: "1:219118293660:web:dc8211dd94c82b6fba5359",
  measurementId: "G-BC07WTTM2B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const auth=getAuth(app)
export { auth, db }; // Export both auth and db to use in other files