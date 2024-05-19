import { getUser } from "../modules/users.js";








const searchBox = document.getElementById('search-applicant');
const applicantBtn = document.getElementById('Applicant-Search');
const findManager = document.getElementById('search-fund-manager');
const fundBtn = document.getElementById('FundManager-Search');
const userdetails = document.getElementById('user-details');
var currentUser;
var ApplicantEmail;
var ManagerEmail

/*
*
*
*/
async function searchApplicant(){
    ApplicantEmail = searchBox.value;
    if(!ApplicantEmail){
        console.log('Enter an email');
        return;
    }
    currentUser = await getUser(ApplicantEmail);
    displayUser();
    console.log('Searched for Applicant');
}

applicantBtn.addEventListener('click',()=>{
    searchApplicant();
});


/*
*
*
*/
async function searchFundManager(){
    ManagerEmail = findManager.value;
    if(!ManagerEmail){
        console.log('Enter an email');
        return;
    }
    currentUser = await getUser(ManagerEmail);
    displayUser();
    console.log('Searched for Fund Manager');
}

fundBtn.addEventListener('click', ()=>{
    searchFundManager();
});


/*
*
*
*/
async function approveUser(){
    console.log('User Approved');
}




/*
*
*
*/
async function blockUser(){
    console.log('User Blocked');
}




/*
*
*
*/
async function changePermissions(){
    console.log('Permissions changed');
}



function displayUser(){
    userdetails.innerHTML = ` `;

    const topPart = document.createElement('div');
    topPart.innerHTML = `
        <p><strong>UID<p>
        <p><strong>Email<p>
        <p><strong>Role<p>
    `;

    topPart.style.display = 'flex';
    topPart.style.justifyContent = 'space-between';
    topPart.style.alignItems = 'center';
    topPart.style.flexDirection = 'row';

    const realData = document.createElement('div');
    realData.innerHTML = `
            <p>ID<p>
            <p> ${currentUser.Email}<p>
            <p>${currentUser.Role}<p>
        <div>
    `;

    realData.style.display = 'flex';
    realData.style.justifyContent = 'space-between';
    realData.style.alignItems = 'center';
    realData.style.flexDirection = 'row';

    userdetails.appendChild(topPart);
    userdetails.appendChild(realData);
}