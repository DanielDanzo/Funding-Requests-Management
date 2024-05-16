import { getUser } from './users.js';


//Function: checks and authorised
async function isAuthorised(role){
    const email = window.localStorage.getItem('email');
    const accessToken = window.localStorage.getItem('token');
    var userToken;

    if(!email){
        return '422';
    }

    userToken = getUser(email).accessToken;
    if(userToken != accessToken){
        return '404';
    }
}




export {
    isAuthorised
}