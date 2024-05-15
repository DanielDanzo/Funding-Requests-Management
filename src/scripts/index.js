// Import the functions you need from the SDKs you need
import { signInUser } from "../modules/users.js";
import { db, auth, provider} from "../modules/init.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js"
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, linkWithCredential, EmailAuthProvider, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


//Below we we initialise any variable we might need for our website
var btn_register = document.getElementById('register-link');
const btn_applicant_login = document.getElementById('btn-applicant-login');
const btn_fundManganer_login = document.getElementById('btn-fundManager-login');
const btn_platformAdmin_login = document.getElementById('btn-platformAdmin-login');

var admin = false;
var fundManager = false;
var applicant = false;

//Can be used to get the information of current user
const user = auth.currentUser;


btn_register.addEventListener('click',()=>{
    //After pressing the register button, user is sent to register page
    window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/register.html';
});

btn_applicant_login.addEventListener('click',()=>{
    //After user clicks login. user will be signed in
    applicant = true;
    signIn(admin, fundManager, applicant);
});

btn_fundManganer_login.addEventListener('click',()=>{
    //After user clicks login. user will be signed in
    fundManager = true;
    signIn(admin, fundManager, applicant);
});

btn_platformAdmin_login.addEventListener('click',()=>{
    //After user clicks login. user will be signed in
    admin = true;
    signIn(admin, fundManager, applicant);
    //console.log('Here we are');
    //registerWithEmail();
});



//FUNCTION: Registers user using their google email
function signIn(admin, fundManager, applicant){
    signInUser(admin, fundManager, applicant);
}
