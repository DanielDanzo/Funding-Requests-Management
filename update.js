import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js"
import { getFirestore, collection, addDoc, getDocs, doc, query, where, orderBy, updateDoc, or, deleteDoc  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDpsbqDksFVO0JpBqZT4gUGa-qW5PDIyVU",
    authDomain: "funding-requests-management.firebaseapp.com",
    databaseURL: "https://funding-requests-management-default-rtdb.firebaseio.com",
    projectId: "funding-requests-management",
    storageBucket: "funding-requests-management.appspot.com",
    messagingSenderId: "663669566432",
    appId: "1:663669566432:web:d34a19ea3989a6c3ce5985",
    measurementId: "G-YW4KG1DXWX"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


let budget;
let information;
let dataList;
let applicantDataList;
let selectedValue;


async function fundingInfo(){
    const querySnapshot = await getDocs(collection(db, "users"));
    users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    allInfo.textContent = "Operation Sucessful";
}

function bursaryInfo(selectedValue, data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].name == selectedValue) {
            information = data[i];
            break;
        }
    }
    budget = information.estimatedFund;
    document.getElementById("name").innerHTML = `Name: ${information.name}`;
    document.getElementById("available").innerHTML = `Available funds: R${budget}`;
}

function accept(index) {
        document.getElementById("summary").innerHTML = `Last accepted applicant: <br> <strong>${applicantDataList[index].applicantName}</strong>`;
        information.estimatedFund -= information.applicantFund;
        budget = information.estimatedFund;
        document.getElementById("available").innerHTML = `Available funds: R${budget}`;
}

function errorMessage(){
    alert("Unfortunately, you have gone beyond your budget!");
}

function changeButton(className, type) {
    const rejectButtons = document.querySelectorAll(`.reject-${className}`);
    const acceptButtons = document.querySelectorAll(`.accept-${className}`);
    
    if(information.estimatedFund > information.applicantFund){
        rejectButtons.forEach(button => {
            const paragraph = document.createElement('p');
            paragraph.style.color = "#138808"
            paragraph.innerText = "Option selected";
            button.parentNode.replaceChild(paragraph, button);
        });

        acceptButtons.forEach(button => {
            button.parentNode.removeChild(button);
        });

        if(type == "accept"){
            accept(className);
        }
    }else{
        errorMessage();
    }
}

const url = (input) => {
    return input.split(" ").join("%20");
}


async function fundingDropDown(dropdown){
    const querySnapshot = await getDocs(collection(db, "Funding Opportunities"));
    dropdown.innerHTML = `<option value="Select">Select</option>`;
    console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
        dropdown.innerHTML += `<option value="${doc.Name}">${doc.Name}</option>`
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const dropdown = document.getElementById("funds");
    let updateFunds = document.getElementById("updateFund");


    await fundingDropDown(dropdown);

    /*
    fetch(`https://funding-requests-management-dfae31570a7e.herokuapp.com/funds`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        dataList = data;
        dropdown.innerHTML = `<option value="Select">Select</option>`;
        data.forEach(element => {
            dropdown.innerHTML += `<option value="${element.name}">${element.name}</option>`
        });
    }).catch(error => {
        console.error(error);
    })*/

    dropdown.addEventListener('change', () => {
        selectedValue = dropdown.value;
        bursaryInfo(selectedValue, dataList);

        fetch(`https://funding-requests-management-dfae31570a7e.herokuapp.com/applicants/${url(selectedValue)}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                applicantDataList = data;
                updateFunds.innerHTML = `<ul id="applicants">`
                for (let i = 0; i < data.length; i++) {
                    updateFunds.innerHTML += `<li>Applicant: ${data[i].applicantName} <br> <input id="rejectBtn" class="reject-${i}" onClick='changeButton("${i}", "reject");' type='button' value='Reject'> <input id="acceptBtn" type='button' class="accept-${i}" onClick='changeButton("${i}", "accept");' value='Accept'><li>`;
                }
                updateFunds.innerHTML += `</ul>`
            } else {
                updateFunds.innerHTML = `No applicants have been found for ${selectedValue}`
            }
        }).catch(error => {
            console.error('Error:', error);
        })

    })
})
