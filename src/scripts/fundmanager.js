import { getAndVerifyEmail } from "../modules/security.js";

const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');

window.onload = await getAndVerifyEmail('Fund Manager');


btn1.addEventListener('click', ()=>{
    window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/infoFunding.html';
});

btn2.addEventListener('click', ()=>{
    window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/updateFunds.html';
});

btn3.addEventListener('click', ()=>{
    window.location.href = 'https://ambitious-glacier-0cd46151e.5.azurestaticapps.net/Report.html';
});
