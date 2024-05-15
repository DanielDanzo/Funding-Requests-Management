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


let budget; //EstimatedFunds should be subtracted with Application Fund
let information;
let dataList;
let applicantDataList;
let selectedValue;

const dropdown = document.getElementById("funds");
let updateFunds = document.getElementById("updateFund");
let applicant;
let applications = [];
let name;


/*  FUNCTION: Retrieves and displays all information about a bursary
*
*
*/
async function fundingInfo(name){
    const q =  query(collection(db, "Funding Opportunity"), where('Name','==',name));
    const querySnapshot = await getDocs(q);
    //const data = querySnapshot.docs.data;
    //console.log(querySnapshot);
    var info;
    //console.log(data);
    querySnapshot.forEach((doc) => {
        //console.log(doc);
        info = doc.data();
        return;
    });

    //console.log(info.Name);
    document.getElementById("name").innerHTML = `<strong>Name:  ${info.Name}`;
    document.getElementById("available").innerHTML = `<strong>Available funds:  R${info.EstimatedFunds}`;
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




updateFunds.addEventListener('click', (event) => {
    if (event.target.classList.contains('reject-btn')) {
        const index = event.target.dataset.index;
        console.log('Button reject Clicked! at: ',index);
        console.log(applications[index]);
        onRejectApplication(name, applications[index].Email)
    }

    else if (event.target.classList.contains('accept-btn')) {
        const index = event.target.dataset.index;
        console.log('Button accept Clicked! at :', index);
        console.log(applications[index]);
        onAcceptApplication(name, applications[index].Email);
    }
});





/*
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
}*/



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

window.onload = await fundingDropDown(document.getElementById("funds"));




/* FUNCTION: Displays all applications
*
*
*/
function displayAllApplications(){
    //Sort the list first before displaying
    applications.sort((str1, str2)=>{
        if (str1.Status ==='Pending' && str2.Status==='Approved') {
            return -1;
        } else if (str1.Status==='Approved' && str2.Status==='Pending') {
            return 1;
        } else {
            return 0;
        }
    });


    updateFunds.innerHTML = '';
    applications.forEach((doc, index) => {
        const app = document.createElement('div');
        app.classList.add('Applicant');
        if(doc.Status === 'Approved'){
            app.innerHTML = `
            <li>Applicant: ${doc.Email} 
            <br> <p style="color: #138808">Application Approved<p> <li>
            `;
        }else{
            app.innerHTML = `
            <li>Applicant: ${doc.Email} 
            <br> <input id="rejectBtn" class="reject-btn"  data-index="${index}" type='button' value='Reject'>
            <input id="acceptBtn" type='button' class="accept-btn"  data-index="${index}" value='Accept'><li>
        `;
        }
        
        updateFunds.appendChild(app);
        
    });
}


/*  FUNCTION: This is a function that displays all the Applications Associated with a Funding Opportunity
*   PARAMS: name-thia is the name of the funding opportunity you want to be displayed
*   The function updated FundingApplications array which will contain all the funding Opportunities
*/
async function getAllFundingApplications(name, updateFunds){
    const userRef = query(collection(db, 'Funding Opportunity'), where('Name','==',name));
    const namesQuerySnapshot = await getDocs(userRef);

    const result = namesQuerySnapshot.docs[0];

    // Reference to the subcollection
    const applicationsRef = collection( result.ref,'Applications');
    const q = query(applicationsRef, orderBy("submitDate", "asc"));
    const querySnapshot = await getDocs(q);


    applications = [];
    if(querySnapshot.empty){
        updateFunds.innerHTML = `No applicants have been found for ${selectedValue}`;
        return;
    }

    //sort according to pending and approved after adding
    
    querySnapshot.forEach((doc) => {
        applications.push(doc.data());
    });
    
    displayAllApplications();
}



dropdown.addEventListener('change', async () => {
    selectedValue = dropdown.value;
    name = selectedValue;
    //Show information about funding opportunity
    //console.log(selectedValue);
    await fundingInfo(selectedValue);
    //Show all funding applications
    await getAllFundingApplications(selectedValue, updateFunds);

})



/*  FUNCTION: This function removes an application to the Funding Opportunity on the Funding Management side
*   PARAMS: fundID-this is the ID of the Funding Opportunity
*           userID-this is the userID of user Application to be removed 
*   This is a void function that removes the application permanently
*/
async function removeFundingApplication(ref){
    deleteDoc(ref)
    .then(() => {
      console.log('Document successfully deleted!');
    })
    .catch((error) => {
      console.error('Error removing document: ', error);
    });
  }
  
  
  /*  FUNCTION: This function is responsible for handling the rejection of applications to Funding Opportunities
  *   PARAMS: FOName- this is the name of the Funding Opportunity
  *           userID- is the ID of the user
  *           fundID- this is the ID of the Funding Opportunity
  *   Is a void function that deletes the application from Funding Opportunity and updates the application on the user side to rejected
  */
  async function onRejectApplication(FOName, email){
    try {
      const userRef = query(collection(db, 'users'), where('Email', '==', email));
      const namesQuerySnapshot = await getDocs(userRef);

      console.log(namesQuerySnapshot);
      const result = namesQuerySnapshot.docs[0];

      const ID = result.ref.path.split('/')[1];
      const appsQuery = query(collection(db,'users', ID, 'Applications'), where('FundingOpportunity', '==',FOName));
      const appsRef = await getDocs(appsQuery);

      await updateDoc(appsRef.docs[0].ref, {
        Status: 'Rejected', 
      })
      .then(async ()=>{
        console.log('Rejected succefully!');
        
        await getAllFundingApplications(FOName, updateFunds);
      })
      .catch((error)=>{
        console.error("Error updating document: ", error)
      });
      
    } catch (e) {
      console.error("Error updating document: ", e);
    }

    try {
      const userRef = query(collection(db, 'Funding Opportunity'), where('Name', '==', FOName));
      const namesQuerySnapshot = await getDocs(userRef);

      const result = namesQuerySnapshot.docs[0];
      console.log('Here');
      console.log(result.ref);

      const appsQuery = query(collection(result.ref, 'Applications'), where('Email','==',email));
      const appsRef =await getDocs(appsQuery);
      await removeFundingApplication(appsRef.docs[0].ref);
    } catch (error) {
      console.error('Error Removing: ',error);
    }
    
  await getAllFundingApplications(FOName, updateFunds);    
}



/*  FUNCTION: This function is responsible for handling the acceptance of applications to Funding Opportunities
*   PARAMS: FOName- this is the name of the Funding Opportunity
*           userID- is the ID of the user
*           fundID- this is the ID of the Funding Opportunity
*   Is a void function that updates the application from Funding Opportunity and  the application on the user side to accepted
*/
async function onAcceptApplication(name, email){
    try {
      const userRef = query(collection(db, 'users'), where('Email', '==', email));
      const namesQuerySnapshot = await getDocs(userRef);

      console.log(namesQuerySnapshot);
      const result = namesQuerySnapshot.docs[0];

      const appsQuery = query(collection(result.ref, 'Applications'), where('FundingOpportunity', '==', name));
      const appsRef = await getDocs(appsQuery);
      console.log(name);
      console.log(appsRef);
      await updateDoc(appsRef.docs[0].ref, {
        Status: 'Approved', 
      })
      .then(()=>{
        console.log("Accepted Sucessfully");
      })
      .catch((error)=>{
        console.error("Error updating document: ", error)
      });
      
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  
    try {
      const userRef = query(collection(db, 'Funding Opportunity'), where('Name', '==', name));
      const namesQuerySnapshot = await getDocs(userRef);

      const result = namesQuerySnapshot.docs[0];
      console.log('Here');
      console.log(result.ref);

      const appsQuery = query(collection(result.ref, 'Applications'), where('Email','==',email));
      const appsRef =await getDocs(appsQuery);
      console.log('there');
      console.log(appsRef);
  
      await updateDoc(appsRef.docs[0].ref, {
        Status: 'Approved', 
      })
      .then(async ()=>{
        console.log("Accepted Sucessfully on Funding Database");
        await getAllFundingApplications(name, updateFunds);
      })
      .catch((error)=>{
        console.error("Error updating document: ", error)
      });
      
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }




/*
document.addEventListener('DOMContentLoaded', async () => {
    const dropdown = document.getElementById("funds");
    let updateFunds = document.getElementById("updateFund");


    //Show all options for all Funding Opportunities aranged aplhabetically
    //await fundingDropDown(dropdown);

    console.log('Here');
    dropdown.addEventListener('change', async () => {
        selectedValue = dropdown.value;
        //Show information about funding opportunity
        console.log(selectedValue);
        await fundingInfo(selectedValue);
        //Show all funding applications
        await showAllFundingApplications(selectedValue, updateFunds);

    })
})*/


