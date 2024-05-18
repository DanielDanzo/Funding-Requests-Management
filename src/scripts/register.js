// Import the functions you need from the SDKs you need
import { registerUser } from "../modules/users.js";
import { auth } from "../modules/init.js";



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
        fundManager = false;
        applicant = false;
    }else if(role === "Fund-Manager"){
        admin = false;
        fundManager = true;
        applicant = false;
    }else{
        admin = false;
        fundManager = false;
        applicant = true;
    }

    if(userName.value && userEmail.value && userIDNum.value && userReason.value && userRole.value){
        sendMail(userEmail.value);
        registerUser(admin, fundManager, applicant, userEmail.value);
    }
})

