// Import the functions you need from the SDKs you need
import { registerUser } from "../modules/users";
import { auth } from "../modules/init";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
/*
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








//SIGN-IN WITH GOOGLE
//create google instance
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
*/

const user = auth.currentUser;
var admin = false;
var fundManager = false;
var applicant = false;


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
          admin = true;
    }else if(role === "Fund-Manager"){
          fundManager = true;
    }else{
          applicant = true;
    }

    if(userName.value && userEmail.value && userIDNum.value && userReason.value && userRole.value){
        sendMail(userEmail.value);
        registerUser();
    }
})

