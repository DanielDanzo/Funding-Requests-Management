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


/*  FUNCTION: Retrieves and displays all information about a bursary
*
*
*/
async function fundingInfo(name){
    const querySnapshot = await getDocs(collection(db, "Funding Opportunity"), where('Name','==',name));
    //const data = querySnapshot.docs.data;
    //console.log(querySnapshot);
    //console.log(data);
    querySnapshot.forEach((doc) => {
        //console.log(doc);
        information = doc.data();
    });

    document.getElementById("name").innerHTML = `Name: ${information.Name}`;
    document.getElementById("available").innerHTML = `Available funds: R${information.EstimatedFunds}`;
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



/*  FUNCTION: Gets all the funding opportunities in the database and adds them to the dropdown menu
*
*
*/
async function fundingDropDown(dropdown){
    const querySnapshot = await getDocs(collection(db, "Funding Opportunity"), orderBy("Name"));
    dropdown.innerHTML = `<option value="Select">Select</option>`;
    //console.log(querySnapshot);
    const allFunds = [];
    querySnapshot.forEach((doc)=>{
        allFunds.push(doc.data().Name);
    });
    allFunds.sort((str1, str2)=>{
        let firstLetterA = str1.charAt(0).toUpperCase();
        let firstLetterB = str2.charAt(0).toUpperCase();

        if (firstLetterA < firstLetterB) {
            return -1;
        } else if (firstLetterA > firstLetterB) {
            return 1;
        } else {
            return 0;
        }
    });
    allFunds.forEach((doc) => {
        dropdown.innerHTML += `<option value="${doc}">${doc}</option>`
    });
}





/*  FUNCTION: This is a function that displays all the Applications Associated with a Funding Opportunity
*   PARAMS: name-thia is the name of the funding opportunity you want to be displayed
*   The function updated FundingApplications array which will contain all the funding Opportunities
*/
async function showAllFundingApplications(name, updateFunds){
    const userRef = query(collection(db, 'Funding Opportunity'), where('Name','==',name));
    const namesQuerySnapshot = await getDocs(userRef);
  
    const doc = namesQuerySnapshot.docs[0];
  
    // Reference to the subcollection
    const applicationsRef = collection( doc.ref,'Applications');
    const q = query(applicationsRef, orderBy("submitDate", "asc"));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty){
        updateFunds.innerHTML = `No applicants have been found for ${selectedValue}`;
        return;
    }

    querySnapshot.forEach((doc) => {
        updateFunds.innerHTML += `<li>Applicant: ${doc.data().Email} <br> <input id="rejectBtn" class="reject-${doc.id}" onClick='changeButton("${doc.id}", "reject");' type='button' value='Reject'> <input id="acceptBtn" type='button' class="accept-${doc.id}" onClick='changeButton("${doc.id}", "accept");' value='Accept'><li>`;
    });
  }

document.addEventListener('DOMContentLoaded', async () => {
    const dropdown = document.getElementById("funds");
    let updateFunds = document.getElementById("updateFund");


    //Show all options for all Funding Opportunities aranged aplhabetically
    await fundingDropDown(dropdown);


    dropdown.addEventListener('change', async () => {
        selectedValue = dropdown.value;
        //Show information about funding opportunity
        await fundingInfo(selectedValue);
        //Show all funding applications
        await showAllFundingApplications(selectedValue, updateFunds);

    })
})
