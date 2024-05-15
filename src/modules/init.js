import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDpsbqDksFVO0JpBqZT4gUGa-qW5PDIyVU",
    authDomain: "funding-requests-management.firebaseapp.com",
    databaseURL: "https://funding-requests-management-default-rtdb.firebaseio.com",
    projectId: "funding-requests-management",
    storageBucket: "funding-requests-management.appspot.com",
    messagingSenderId: "663669566432",
    appId: "1:663669566432:web:d34a19ea3989a6c3ce5985",
    measurementId: "G-YW4KG1DXWX"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

module.export = {db};