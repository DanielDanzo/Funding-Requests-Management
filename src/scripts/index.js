// Import the functions you need from the SDKs you need
import { signInUser } from "../modules/users.js";
import { auth } from "../modules/init.js";
import { modal } from "./notifications.js";

for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        console.log(`${key}: ${value}`);
    }

if(window.localStorage.getItem('Restricted') !== null){
    if(window.localStorage.getItem('Restricted') === "yes"){
    modal(`Sorry... You have been blocked.`);
    }
    window.localStorage.removeItem('Restricted');
}

//Below we we initialise any variable we might need for our website
var btn_register = document.getElementById('register-link');
const btn_login = document.getElementById('btn-login');

//Can be used to get the information of current user
const user = auth.currentUser;

btn_register.addEventListener('click',()=>{
    //After pressing the register button, user is sent to register page
    window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/register.html';
});

btn_login.addEventListener('click',()=>{
    //After user clicks login. user will be signed in
    //applicant = true;
   // fundManager = false;
    //admin = false;
    signIn();
});



//FUNCTION: Registers user using their google email
function signIn(){
    signInUser(document.getElementById('response'));
}
