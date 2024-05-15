import {db, auth, provider} from './init.js';
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";



//Function to check if user is registered
async function verifyRole(email, role){
    try {
        console.log('Verifying role.....');
        const q = query(collection(db, 'users'), where('Email', '==', email), where('Role', '==',role));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        if(querySnapshot.empty){
            return false;
        }
        return true;
      } catch (error) {
        console.error(error);
      }
}


//Function to check if user is registered
async function verifyUser(email){
    try {
        console.log('Verifying Email');
        const q = query(collection(db, 'users'), where('Email', '==', email));
        const querySnapshot = await getDocs(q);
        if(querySnapshot.empty){
            return false;
        }
        return true;
      } catch (error) {
        console.error(error);
      }
}

//Function to set the email
function setEmail(email){
    window.localStorage.setItem('email', email);
}

//FUNCTION: Registers user using their google email
function signInUser(admin, fundManager, applicant){
    //sign-in using small window prompt
    signInWithPopup(auth, provider)
    .then(async (result) => {
        const user = result.user;
        const email = user.email;
        setEmail(email);

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
            window.location.href ='https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/admin.html';
        }else if(fundManager){
            if( !(await verifyRole(email, 'fundManager')) ){
                console.log('Please sign-in with registered role')
                return;
            }
            window.location.href ='https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/fundmanager.html';
        }else{
            if( !(await verifyRole(email, 'Applicant')) ){
                console.log('Please sign-in with registered role')
                return;
            }
            window.location.href ='https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/applicant.html';
        }
        
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}



export {
    verifyRole,
    verifyUser,
    setEmail,
    signInUser
};