import { getUser } from "../modules/users.js";


const searchBox = document.getElementById('search-applicant');
const applicantBtn = document.getElementById('Applicant-Search');
const findManager = document.getElementById('search-fund-manager');
const fundBtn = document.getElementById('FundManager-Search');
const main = document.getElementById('main');

//const userdetails = document.getElementById('user-details');
//const fullDiv = document.getElementById('user-details');
//const userInfo = document.getElementById('user-info');
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
        console.log('Enter user Details');
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
        console.log('Enter a Funding Opportunity');
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
    const sec = document.createElement('section');
    sec.className = 'user-actions';
    const userInfo = document.createElement('table');
    userInfo.className='user-table';

    userInfo.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Daniel</td>
                <td>${currentUser.Email}</td>
                <td>${currentUser.Role}</td>
                <td class='btn'>
                    <button>Approve</button>
                    <button>Block</button>
                    <button>Permissions</button>
                </td>
            </tr>
        </tbody>
    `;
    sec.appendChild(userInfo);

    main.appendChild(sec);
}