import { getUser, verifyRole, signOutUser } from './users.js';
import { auth } from './init.js';



//Function: checks and authorised
async function isAuthorised(email, role){
    const verified = await verifyRole(email, role);
    if(!verified){
        const role = await getUser(email).Role;
        console.log(role);
        console.error('404 error');
        return ;
    }

    if(!email){
        window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/index.html';
        console.error('422 error');
        return;
    }



    //Check if user in cache in the same user currently logged in
    var userToken;
    userToken = getUser(email).accessToken;
    const realToken = window.localStorage.getItem('token');
    if(userToken != realToken){
        signOutUser();
        window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/index.html';
        //console.log('Please register');
        return;
    }
}

async function getAndVerifyEmail(role){
    console.log('Verifying...');
    const user = auth.currentUser;
    if(!user){
        console.log(user);
        window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/index.html';
        return;
    }
    const email = user.email;
    console.log(email);
    isAuthorised(email, role);
}


export {
    isAuthorised,
    getAndVerifyEmail
}
