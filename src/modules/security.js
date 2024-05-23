import { getUser, verifyRole, signOutUser } from './users.js';
import { getAuth, auth } from './init.js';
import { onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"



//Function: checks and authorised
async function isAuthorised(email, role){
    const verified = await verifyRole(email, role);
    if(!verified){
        const role = await getUser(email).Role;
        if( role === 'Admin'){
            window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/AdminUpdate.html'; 
        }else if( role === 'Fund Manager'){
            window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/fundmanager.html'; 
        }else{
            window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/applicant.html'; 
        }
        return;
    }

    if(!email){
        window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/index.html';
        //console.error('422 error');
        return;
    }



    //Check if user in cache in the same user currently logged in
    /*
    var userToken;
    userToken = getUser(email).accessToken;
    const realToken = window.localStorage.getItem('token');
    if(userToken != realToken){
        //console.log('Token ',userToken);
        //console.log('RealToken: ',realToken);
        //signOutUser();
        window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/index.html';
        //console.log('Please register');
        return;
    }*/
}

async function getAndVerifyEmail(role){
    //console.log('Verifying...');
    onAuthStateChanged(auth, async (user)=>{
        console.log(user);
        if(!user){
            window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/index.html';
            return;
        }else{
            const email = user.email;
            //console.log(user);
            isAuthorised(email, role)
        }
    });
    
}


export {
    isAuthorised,
    getAndVerifyEmail
}
