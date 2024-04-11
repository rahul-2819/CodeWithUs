// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyBluVfOMh05T4lQ-uzcSoY3VCAsEtXNZc8",
  authDomain: "my-project-4b1ef.firebaseapp.com",
  databaseURL: "https://my-project-4b1ef-default-rtdb.firebaseio.com",
  projectId: "my-project-4b1ef",
  storageBucket: "my-project-4b1ef.appspot.com",
  messagingSenderId: "658121541757",
  appId: "1:658121541757:web:5d786c4ba83e910d110914",
  measurementId: "G-8BB8B8WSW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export {app,auth};