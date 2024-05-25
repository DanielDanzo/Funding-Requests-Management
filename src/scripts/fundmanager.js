import { getAndVerifyEmail } from "../modules/security.js";

const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const SignOutBtn = document.getElementById('fixedButton');

window.onload = await getAndVerifyEmail('Fund Manager');

if(window.localStorage.getItem('Blocked') !== null){
    let role = window.localStorage.getItem('Blocked');
    modal(`Access not granted as you did not register as ${role}.`);
    
    window.localStorage.removeItem('Blocked');
}

SignOutBtn.addEventListener('click', () =>{
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.removeItem(key);
        console.log(`${key}: ${value}`);
    }
    window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/index.html';
    
});

btn1.addEventListener('click', ()=>{
    window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/infoFunding.html';
});

btn2.addEventListener('click', ()=>{
    window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/updateFunds.html';
});

btn3.addEventListener('click', ()=>{
    window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/Report.html';
});
