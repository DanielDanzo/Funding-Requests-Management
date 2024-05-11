// Import the functions you need from the SDKs you need
//import { signInWithPopup, getRedirectResult, GoogleAuthProvider , signInWithRedirect, initializeApp, getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, linkWithCredential, EmailAuthProvider, signOut } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js"
//import { initializeApp } from "./node_modules/firebase/app/firebase-app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { getFirestore, collection, addDoc, getDocs, doc, query, where  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
//import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "./node_modules/firebase/app/firebase-auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpsbqDksFVO0JpBqZT4gUGa-qW5PDIyVU",
  authDomain: "funding-requests-management.firebaseapp.com",
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


/*  FUNCTION: checks whether or not a user is in the database
*   PARAMETERS: email- each user has a unique email which will help us identify users
*   This function should return true or false based on whether or not a user is registered or not
*/
async function isRegistered(email){
    const userRef = query(collection(db, 'users'), where('Email', '==', email));

    const querySnapshot = getDocs(userRef);
    console.log(querySnapshot);
    console.log('Is snapShot empty: ',querySnapshot.value === undefined);
    console.log(querySnapshot.doc);
    if(querySnapshot.empty){
        console.log('Here');
        
        console.log(querySnapshot.empty);
        return false;
    }

    return true;
}

/*  FUNCTION: Adds user to the database
*   PARAMETERS: email- User email that we need to has
*               role- specifies the role of the user
*               isSignIn- specifies whether or not user is SignedIn
*               token- this is the token received from google signIn
*   TODO: Hash email address for security issues
*/
async function addUser(email, role, isSignIn, userToken){
    console.log('Email: ',email);
    console.log('Role : ',role);
    console.log('Status: ',isSignIn);
    console.log('Token: ',userToken);
    try {

        const registeredUser = await isRegistered(email);
        console.log(registeredUser);
        if(registeredUser){
            console.log('User already registered');
            return false;
        }
        const userRef = collection(db, 'users');

        const docRef = await addDoc(userRef, {
          Email: email,
          Role: role,
          isSignIn: isSignIn,
          Token: userToken
        });
        console.log("Sucessfully Added");
        return true;
      } catch (e) {
        console.error("Error adding document: ", e);
    }
}




//SIGN-IN WITH GOOGLE
//create google instance
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const user = auth.currentUser;
var admin = false;
var fundManager = false;
var applicant = false;

function registerUser(){
    //sign-in using small window prompt
    signInWithPopup(auth, provider)
    .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log(credential);
        // The signed-in user info.
        console.log(result);
        const user = result.user;
        const userToken = await result.user.accessToken;
        console.log(user);
        if(admin && (await addUser(user.email, "Admin", true, userToken)) ){
            window.location.href ='https://danieldanzo.github.io/Funding-Requests-Management/admin.html';
        }else if(fundManager && (await addUser(user.email, "Fund Manager", true, userToken)) ){
            window.location.href ='https://danieldanzo.github.io/Funding-Requests-Management/fundmanager.html';
        }else if(applicant && (await addUser(user.email, "Applicant", true, userToken)) ){
            window.location.href ='https://danieldanzo.github.io/Funding-Requests-Management/applicant.html';
        }else{
            console.log("Invalid login details");
        }
        
    }).catch((error) => {
        // Handle Errors here.
        console.log(error);
        console.log('Error code: ', error.code);
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

function sendMail(EMail){
                (function(){
                    emailjs.init("u7aPmoilsd1g-HeLQ");
                })();

                var params = {
                    sendername:"LoyalFunding",
                    to: EMail,
                    subject: "Registration",
                    replyto: "noreply@gmail.com",
                    message:"You are now registered",
                };
                var serviceID = "service_4jnlv73";
                var templateID = "template_e2xx532"; 

                emailjs.send(serviceID,templateID,params)
                .then( res => {
                    alert("Mail sent");
              })
              .catch();
            }


const btn_submit_signup = document.getElementById('btn-submit-signup');

btn_submit_signup.addEventListener('click', ()=>{
    const userName = document.getElementById('fullname');
    const userEmail = document.getElementById('email');
    const userIDNum = document.getElementById('ID');
    const userReason = document.getElementById('Reason');
    const userRole = document.getElementById('Type');

    const role = userRole.value;
    if( role === "Admin"){
          console.log('Admin');
          admin = true;
          console.log(admin);
    }else if(role === "Fund-Manager"){
          console.log('fundmanager');
          fundManager = true;
          console.log(fundManager);
    }else{
          console.log('applicant')
          applicant = true;
          console.log(applicant)
    }

    if(userName.value && userEmail.value && userIDNum.value && userReason.value && userRole.value){
        sendMail(userEmail.value);
        registerUser();
    }
    //alert('Hello');
    
})

