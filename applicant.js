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


const OPList = document.getElementById('opportunities-list');
//const email = window.localStorage.getItem('email');
const email = 'sempapadaniel123@gmail.com';
const dropdown = document.getElementById('fundingId');
const statusList = document.getElementById('status-list');
const submitBtn = document.getElementById('submit-btn');
var closingDate;
var applicationList;
var applications;




window.onload = await getAllFundingApplications();
window.onload = await fundingDropDown(dropdown);
window.onload = await loadApplications(email);

/*  FUNCTION: This is a function that displays all the Applications Associated with a Funding Opportunity
*   PARAMS: name-thia is the name of the funding opportunity you want to be displayed
*   The function updated FundingApplications array which will contain all the funding Opportunities
*/
async function getAllFundingApplications(){
    //console.log('Entered');
    const userRef = query(collection(db, 'Funding Opportunity'), orderBy("ClosingDate", "desc"));
    const namesQuerySnapshot = await getDocs(userRef);


    /*
    const result = namesQuerySnapshot.docs[0];

    // Reference to the subcollection
    const applicationsRef = collection( result.ref,'Applications');
    const q = query(applicationsRef, orderBy("ClosingDate", "desc"));
    const querySnapshot = await getDocs(q);*/


    applications = [];
    if(namesQuerySnapshot.empty){
        return;
    }

    //sort according to pending and approved after adding
    namesQuerySnapshot.forEach((doc) => {
        applications.push(doc.data());
    });
    
    displayAllApplications(OPList,applications,'fundingList');
}



/* FUNCTION: Displays all applications on the page
*
*
*/
function displayAllApplications(fullList, array, type){
    fullList.innerHTML = '';
    const list = document.createElement('ul');
    array.forEach((doc, index) => {
        var displayName;
        const listDate = document.createElement('p');
        if(type === 'applicationList'){
            displayName = doc.FundingOpportunity;
            listDate.textContent = doc.Status;
            if(doc.Status == 'Approved'){
                listDate.style.color = '#138808';
            }else if(doc.Status == 'Rejected'){
                listDate.style.color = '#FF0000';
            }
            
            
        }else{
            displayName = doc.Name;
            listDate.textContent = 'Closing Date: '+doc.ClosingDate;
        }
        //console.log(doc);
        const app = document.createElement('li');
        app.classList.add('funding-opportunities');
        const listName = document.createElement('p');

        listName.textContent = 'Name: ';
        listName.style.fontWeight = "bold"
        listName.textContent += displayName ;

        

        app.appendChild(listName);
        app.appendChild(listDate);
        app.style.justifyContent = "space-between";
        app.style.display = "flex";
        app.style.flexDirection = "row";
        list.appendChild(app);    
    });

    fullList.appendChild(list);
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

    //results from database
    querySnapshot.forEach((doc)=>{
        allFunds.push(doc.data().Name);
    });

    //sorts the funding opportunity array
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

    //display or add the Funding Opportunities to the dropdown menu
    allFunds.forEach((doc) => {
        dropdown.innerHTML += `<option value="${doc}">${doc}</option>`
    });
}


/*  FUNCTION: gets and displays all the applications of a applicant
*
*
*/
async function loadApplications(email){
    try {
        const userRef = query(collection(db, 'users'), where('Email', '==', email));
        const appSnapshot = await getDocs(userRef);
  
        // Reference to the subcollection
        console.log(appSnapshot);
        const applicationsRef = query(collection(appSnapshot.docs[0].ref, 'Applications'), orderBy('Status', 'asc'));
        const querySnapshot = await getDocs(applicationsRef);

        applicationList = [];
        querySnapshot.forEach((doc)=>{
            applicationList.push(doc.data());
        });
        displayAllApplications(statusList, applicationList,'applicationList');

    } catch (error) {
        console.error('Error fetching Document: ', error);
    }
}



/*  FUNCTION: Creates and/or adds a subcollection
*   In this case it creates a subcollection that stores all user Applications
*   PARAMS: userID- is the userID that comes from the database and is used to get the user document
*           After getting user document we create a collection in that user document
*   TODO: be able to update status
*/
async function addUserApplication(email, closingDate, FOName){
    try {
        // Reference to the user document
        const userRef = query(collection(db, 'users', userID), where('Email', '==', email));
        const appSnapshot = await getDocs(userRef);
  
        // Reference to the subcollection
        const applicationsRef = collection(appSnapshot.docs[0].ref, 'Applications');
        const currentDate = new Date().toLocaleDateString();
  
        const docRef = await addDoc(applicationsRef, {
          FundingOpportunity: FOName,
          Status: "Pending",
          submitDate: currentDate,
          closingDate: closingDate
        });
        console.log("Added user Application Sucessfully");
      } catch (e) {
        console.error("Error adding document: ", e);
    }
}



/*  FUNCTION: This is a function that adds a funding Opportunity Application to the Funding Opportunity
*   PARAMS: userID- this is the ID of the user
*           closingDate- this is the closing date of the funding opportunity
*/
async function addFundingApplication(FOName, email){
    try {
  
      // Reference to the user document
      const userRef = query(collection(db, 'Funding Opportunity'), where('Name', '==',FOName));
      const appsRef = await getDocs(userRef);
  
      // Reference to the subcollection
      const applicationsRef = collection(appsRef.docs[0].ref, 'Applications');
      const currentDate = new Date().toLocaleDateString();
  
      const docRef = await addDoc(applicationsRef, {
        Email: email,
        Status: "Pending",
        submitDate: currentDate
      });
      console.log("Added Funding Application Sucessfully");
    } catch (e) {
      console.error("Error adding document: ", e);
  }
}


/*  FUNCTION: returns an array full of all the applications made by user in the database
*   PARAMS: userID- used to navigate to user documents
*   Check whether or not a user has applied to a specific Funding Opportunity
*/
async function allowUserApplication(email, FOName){
    const userRef = query(collection(db, 'users'), where('Email', '==',email));
    const namesQuerySnapshot = await getDocs(userRef);

    const result = namesQuerySnapshot.docs[0];

    // Reference to the subcollection
    const applicationsRef = collection( result.ref,'Applications');
    const q = query(applicationsRef, where('Name', '==',FOName), where('Status', '==', 'Pending'));
    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty){
      return true;
    }
    return false;
}



/* FUNCTION: This is a function dedicated to allow users to be able to apply for Funding Opportunity
*  PARAMS: userID- This corresponds to the ID of the user
*   This functions does the operations and exits.
*/
async function applyForFundingOpportunity(FOName){
    const isValidApplication = await allowUserApplication(email, FOName);
    //If a user has already applied for the Funding Opportunity then they cant apply again
    if(!isValidApplication){
      console.log('Already Applied for this Funding Opportunity');
      return;
    }
  
    closingDate = applications.find((element)=>{
        if(element.Name === FOName){
            return element.ClosingDate;
        }
    });
    console.log(closingDate);
    addUserApplication(email, closingDate, FOName);
    addFundingApplication(FOName);
}



submitBtn.addEventListener('click', ()=>{
    const FOName = dropdown.value;
    applyForFundingOpportunity(FOName);
});