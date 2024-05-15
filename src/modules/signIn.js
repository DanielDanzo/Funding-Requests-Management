import {db, auth, provider} from './init.js';
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


function popUp(){
    //sign-in using small window prompt
    signInWithPopup(auth, provider)
    .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log(credential);
        // The signed-in user info.
        console.log(result);
        return result.user;
        
    }).catch((error) => {
        // Handle Errors here.
        console.log(error);
        console.log('Error code: ', error.code);
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}




export { popUp }