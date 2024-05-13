import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js"
import { getFirestore, collection, addDoc, getDocs, doc, query, where  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


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
const email =  window.localStorage.getItem('email');


/* FUNCTION: Checks whether or not there is another funding opportunity with the exact same name
* PARAMS: name- this is the name of funding opportunity to verify or chack if it already exists
*  Should return true if there is no funding opportunity with the same name
*/
async function verifyFundingName(name){
    const userRef = query(collection(db, 'Funding Opportunity'), where('Name','==',name));
    const namesQuerySnapshot = await getDocs(userRef);
    if(namesQuerySnapshot.empty){
      return true;
    }
    //console.log('Please use a different Funding name');
    return false;
}


/*  FUNCTION: Creates and/or adds a subcollection for roles 
*   In this case it creates a subcollection that stores all user roles
*   PARAMS: userID- is the userID that comes from the database and is used to get the user document
*           After getting user document we create a collection in that user document
*   TODO: be able to update status
*/
async function addUserRole(FOName, email){
  try {
      // Reference to the user document
      const q = query((db, 'Funding Opportunity'), where('Name', '==', FOName));
      const FORef = doc(q);

      // Reference to the subcollection
      const roleRef = collection(FORef, 'Roles');

      const docRef = await addDoc(applicationsRef, {
        userEmail: email,
        Role: "fundManager",
      });
      console.log("Added Role Sucessfully");
    } catch (e) {
      console.error("Error adding document: ", e);
  }
}


/*  FUNCTION: This function creates a funding opprtunity
*   PARAMS: FOName- this is the name of the funding opportunity
*           type- specifies the type of funding(eg.Educational)
*           budget- explains the amount of money the Fund Manager is willing to spend on the Funding Opportunity
*           description- self-explanatory, is the Funding Opportunity description
*           closing- this is the closing date of the funding Opportunity
*   The function adds to fundingOpportunities list which stores a list of all funding Opportunities
*/
async function createFundingOportunity(name, type, estimatedFund, applicantFund,suitable, deadline,summary){
    try {
      const verified = await verifyFundingName(name);
      //If !verified then the name of the funding opportunity to be created already exists
      if(!verified){
        console.log('Funding Opportunity with the same name exists');
        return;
      }
      await addUserRole(name, email);
  
      const docRef = await addDoc(collection(db, "Funding Opportunity"), {
        Name: name,
        Type: type,
        EstimatedFunds: estimatedFund,
        ApplicantFund: applicantFund,
        Description: summary,
        SuitableCandidates: suitable,
        ClosingDate: deadline
      });
      console.log("Sucessfully Added");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }




const submit = document.getElementById("btn-submit");

function addFunds(addition) {
    fetch('https://funding-requests-management-dfae31570a7e.herokuapp.com/funds', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addition)
    })
        .then(response => {
            console.log("The fetch function was successful"); 
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

submit.addEventListener('click', event => {
    event.preventDefault();
    const name = document.getElementById("fund-name").value;
    const type = document.getElementById("Type").value; 
    const estimatedFund = document.getElementById("est-fund").value;
    const applicantFund = document.getElementById("fund-applicant").value;
    const suitable = document.getElementById("fund-applicant").value;
    const deadline = document.getElementById("app-deadline").value;
    const summary = document.getElementById("more-info").value;
    addFunds({ name, type, estimatedFund, applicantFund, suitable, deadline, summary });
    createFundingOportunity(name, type, estimatedFund, applicantFund,suitable, deadline,summary);
});


