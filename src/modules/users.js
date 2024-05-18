import { db, auth, provider } from './init.js';
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import {  GoogleAuthProvider  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";




/*   FUNCTION: Used to help us find the userID  of a specific user which will be used through out our query searches
*   PARAMS: email- will be used to find the row that contains the email, essentially locating the user
*   TODO: Hash the email so it can correspond with the hashed email in our database
*   This funtion returns the userID of a user
*/  
async function getUserID(email){
    try {
      const q = query(collection(db, 'users'), where('Email', '==', email));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs[0].id);
      return querySnapshot.docs[0].id;
  
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


/*
*
*
*/
async function AssignRole( email){
    const user =await getUser(email);
    return user.Role;

}



//FUNCTION: Registers user using their google email
async function signInUser(){
    //sign-in using small window prompt
    signInWithPopup(auth, provider)
    .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        //console.log(credential);
        // The signed-in user info.
        //return result.user;
        const user = result.user;
        const email = user.email;
        setEmail(email);

        const verified = await verifyUser(email);
        // The signed-in user info.
        if(!verified){
            console.log('Please register');
            return;
        }


        const role = await AssignRole( email);

        //Then take the user to their desired home page
        if(role === 'Admin'){
            window.location.href ='https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/admin.html';
        }else if(role === 'fundManager'){
            window.location.href ='https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/fundmanager.html';
        }else{
            window.location.href ='https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/applicant.html';
        }
            
        }).catch((error) => {
            // Handle Errors here.
            console.log(error);
            console.log('Error code: ', error.code);
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    
}


/*  FUNCTION: checks whether or not a user is in the database
*   PARAMETERS: email- each user has a unique email which will help us identify users
*   This function should return true or false based on whether or not a user is registered or not
*/
async function isRegistered(email){
    const userRef = query(collection(db, 'users'), where('Email', '==', email));

    const querySnapshot = await getDocs(userRef);
    console.log(querySnapshot);
    //console.log('Is snapShot empty: ',querySnapshot.value === undefined);
    //console.log(querySnapshot.doc);
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
    //console.log('Email: ',email);
    //console.log('Role : ',role);
    ////console.log('Status: ',isSignIn);
    //console.log('Token: ',userToken);
    try {

        const registeredUser = await isRegistered(email);
        //console.log(registeredUser);
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


async function registerUser(admin, fundManager, applicant, email){
    //sign-in using small window prompt
    signInWithPopup(auth, provider)
    .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if( result.user.email != email){
            console.log(result.user.emai);
            console.log(email);
            console.log('Please Provide a valid email');
            return;
        }
        //console.log(credential);
        // The signed-in user info.
        //console.log('here');
        const user = result.user;
        console.log(user.email);
        console.log(admin, fundManager, applicant);
        //console.log('Now Here');
        //console.log(user);
        const userToken = await user.accessToken;
        if(admin && (await addUser(user.email, "Admin", true, userToken)) ){
            window.location.href ='https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/admin.html';
        }else if(fundManager && (await addUser(user.email, "Fund Manager", true, userToken)) ){
            window.location.href ='https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/fundmanager.html';
        }else if(applicant && (await addUser(user.email, "Applicant", true, userToken)) ){
            window.location.href ='https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/applicant.html';
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

/*  FUNCTION: To get a specific user
*
*
*/
async function getUser(email){
    try {
        const q = query(collection(db, 'users'), where('Email', '==', email));
        const querySnapshot = await getDocs(q);
        console.log(email);
        console.log(querySnapshot);
        var resultUser = undefined;
        if(querySnapshot.empty){
            return resultUser;
        }
        querySnapshot.forEach(doc => {
            resultUser = doc.data()
            return ;
        });
        return resultUser;
    } catch (error) {
       console.error('Error Retrieving Object: ',error); 
    }
}

export {   verifyRole, verifyUser, setEmail, signInUser, isRegistered, addUser, registerUser, getUser, getUserID };