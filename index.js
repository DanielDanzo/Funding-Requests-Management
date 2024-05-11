// Import the functions you need from the SDKs you need
//import { getRedirectResult , signInWithRedirect, signOut } from "firebase/app";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js"
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, linkWithCredential, EmailAuthProvider, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


//Below we we initialise any variable we might need for our website

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
var btn_register = document.getElementById('register-link');
const btn_applicant_login = document.getElementById('btn-applicant-login');
const btn_fundManganer_login = document.getElementById('btn-fundManager-login');
const btn_platformAdmin_login = document.getElementById('btn-platformAdmin-login');
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
//create google instance
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
var admin = false;
var fundManger = false;
var applicant = false;

//Can be used to get the information of current user
const user = auth.currentUser;

/*
//Now we signOut the user
signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});*/



/*
//sign-in by redirecting
signInWithRedirect(auth, provider);

//Get Google Auth token
getRedirectResult(auth)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

*/

btn_register.addEventListener('click',()=>{
    //After pressing the register button, user is sent to register page
    window.location.href = 'https://danieldanzo.github.io/Funding-Requests-Management/register.html';
});

btn_applicant_login.addEventListener('click',()=>{
    //After user clicks login. user will be signed in
    applicant = true;
    signInUser();
});

btn_fundManganer_login.addEventListener('click',()=>{
    //After user clicks login. user will be signed in
    fundManger = true;
    signInUser();
});

btn_platformAdmin_login.addEventListener('click',()=>{
    //After user clicks login. user will be signed in
    admin = true;
    signInUser();
    //console.log('Here we are');
    //registerWithEmail();
});


//Function to check if user is registered
async function verifyUser(email){
    try {
        console.log('Verifying email.....');
        console.log(email);
        const q = query(collection(db, 'users'), where('Email', '==', email));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        console.log('Docs: ',querySnapshot.docs);
        console.log('Empty: ', querySnapshot.empty);
        console.log('Snapshot: ', querySnapshot.docs.empty );
        if(querySnapshot.empty){
            return false;
        }
        return true;
      } catch (error) {
        console.error(error);
      }
}

//Function to check if user is registered
async function verifyRole(email, role){
    try {
        console.log('Verifying role.....');
        const q = query(collection(db, 'users'), where('Email', '==', email), where('Role', '==',role));
        const querySnapshot = await getDocs(q);
        console.log('Role Snapshot: ', querySnapshot);
        if(querySnapshot.empty){
            return false;
        }
        return true;
      } catch (error) {
        console.error(error);
      }
}


//FUNCTION: Registers user using their google email
function signInUser(){
    //sign-in using small window prompt
    signInWithPopup(auth, provider)
    .then(async (result) => {
        const user = result.user;
        console.log('User: ',user);
        const email = user.email;
        console.log('Email: ',email);

        const verified = await verifyUser(email);
        // The signed-in user info.
        if(!verified){
            console.log('Please register');
            return;
        }
        //Then take the user to their desired home page
        if(admin){
            if( !(await verifyRole(email, 'Admin')) ){
                console.log('Please sign-in with registered role')
                return;
            }
            window.location.href ='https://danieldanzo.github.io/Funding-Requests-Management/admin.html';
        }else if(fundManger){
            if( !(await verifyRole(email, 'fundManager')) ){
                console.log('Please sign-in with registered role')
                return;
            }
            window.location.href ='https://danieldanzo.github.io/Funding-Requests-Management/fundmanager.html';
        }else{
            if( !(await verifyRole(email, 'Applicant')) ){
                console.log('Please sign-in with registered role')
                return;
            }
            window.location.href ='https://danieldanzo.github.io/Funding-Requests-Management/applicant.html';
        }
        
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}


function registerWithEmail(){
    console.log('Hello');
    //get user email
    email = 'sempapadaniel123@gmail.com';

    const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: 'https://danieldanzo.github.io/Google-Verification-test/home.html',
        // This must be true.
        handleCodeInApp: true,
        iOS: {
            bundleId: 'com.LoyalAid.ios'
        },
        android: {
            packageName: 'com.LoyalAid.android',
            installApp: true,
            minimumVersion: '12'
        },
        dynamicLinkDomain: 'example.page.link'
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            console.log('Hello2');
        // The link was successfully sent. Inform the user.
        console.log('Successfully logged in');
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
        // ...
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
        });

    //complete signIn by checking whether the send link is the same as the link received from email
    // Confirm the link is a sign-in with email link.
    if (isSignInWithEmailLink(auth, window.location.href)) {
        console.log('Hello3');
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            console.log('Hello4');
            // User opened the link on a different device. To prevent session fixation
            // attacks, ask the user to provide the associated email again. For example:
            email = window.prompt('Please provide your email for confirmation');
        }
        // The client SDK will parse the code from the link for you.
        signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
            console.log('Hello5');
            // Clear email from storage.
            window.localStorage.removeItem('emailForSignIn');
            // You can access the new user via result.user
            console.log(result.user);
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            console.log(result.additionalUserInfo.isNewUser);
        })
        .catch((error) => {
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
        });
    }

    //SingIn when user is already authentificated
    //NOTE: -User has to login in the same device where he first logged in otherwise we re-authentificate
    // Construct the email link credential from the current URL.
    const credential = EmailAuthProvider.credentialWithLink(
        email, window.location.href);

    // Link the credential to the current user.
    linkWithCredential(auth.currentUser, credential)
        .then((usercred) => {
            console.log('Hello6');
        // The provider is now successfully linked.
        // The phone user can now sign in with their phone number or email.
        })
        .catch((error) => {
        // Some error occurred.
        });
}

