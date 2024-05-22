import { getfundingByName, getRoleOrderedFungingOpportunity, getAllFundingApplications } from "../modules/funding.js";
import { onUserRejectApplication, onUserAcceptApplication } from "../modules/userApplications.js";
import { onFundingAcceptApplication, onFundignRejectApplication } from "../modules/fundingApplication.js";
import { getDocuments } from "../modules/storage.js";
import { getEmail } from "../modules/users.js";



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

//When page is loaded do this
window.onload = await fundingDropDown(document.getElementById("funds"));


/*  FUNCTION: Retrieves and displays all information about a bursary
*
*
*/
async function fundingInfo(name){
  var info = await getfundingByName(name);
  //const Transactions = info.TransactionSummary;
  //Transactions['1'] = 50;
  //console.log(Transactions);

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




updateFunds.addEventListener('click', async (event) => {
  if (event.target.classList.contains('reject-btn')) {
      const index = event.target.dataset.index;
      //console.log('Button reject Clicked! at: ',index);
      //console.log(applications[index]);
      //TODO: Notification to fundmanager informing him: "Application Rejcted!";
      onRejectApplication(name, applications[index].Email)
  }

  else if (event.target.classList.contains('accept-btn')) {
      const index = event.target.dataset.index;
      //console.log('Button accept Clicked! at :', index);
      //console.log(applications[index]);
      onAcceptApplication(name, applications[index].Email);
  }


  else if(event.target.classList.contains('retrieve-btn')){
    const index = event.target.dataset.index;
    //console.log('Retrieve button clicked at :', index);
    await getDocuments(name, applications[index].Email);
  }
});




/*  FUNCTION: Gets all the funding opportunities in the database and adds them to the dropdown menu
*
*
*/
async function fundingDropDown(dropdown){
    dropdown.innerHTML = `<option value="Select">Select</option>`;
    const allFunds = await getRoleOrderedFungingOpportunity(getEmail);

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

    const userInfo = document.createElement('table');
    userInfo.className = 'user-table';

    userInfo.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
    `;
    
    applications.forEach((doc, index) => {
        if(doc.Status === 'Approved'){
            const app = document.createElement('tbody');
            app.innerHTML = `
            <tr>
                <td>${doc.Email}</td>
                <td>${doc.submitDate}</td>
                <td class='approved-status'>Approved</td>
                <td class='btns'>
                    <input id="retrieveBtn" type='button' class="retrieve-btn"  data-index="${index}" value='Documents'>
                </td>
            </tr>
            `;

            userInfo.appendChild(app);
        }else{
            const app = document.createElement('tbody');
            app.innerHTML = `
            <tr>
                <td>${doc.Email}</td>
                <td>${doc.submitDate}</td>
                <td >Pending</td>
                <td class='btns'>
                    <input id="rejectBtn" class="reject-btn"  data-index="${index}" type='button' value='Reject'>
                    <input id="acceptBtn" type='button' class="accept-btn"  data-index="${index}" value='Accept'>
                    <input id="retrieveBtn" type='button' class="retrieve-btn"  data-index="${index}" value='Documents'>
                </td>
            </tr>
            `;

            userInfo.appendChild(app);
        }  
    });
    updateFunds.appendChild(userInfo);
}


/*  FUNCTION: This is a function that displays all the Applications Associated with a Funding Opportunity
*   PARAMS: name-thia is the name of the funding opportunity you want to be displayed
*   The function updated FundingApplications array which will contain all the funding Opportunities
*/
async function displayFundingApplications(name, updateFunds){
  applications = await getAllFundingApplications(name);
  if(applications.length === 0){
    updateFunds.innerHTML = `No applicants have been found for ${selectedValue}`;
    return;
  }
  displayAllApplications();
}



dropdown.addEventListener('change', async () => {
    selectedValue = dropdown.value;
    name = selectedValue;
    //Show information about funding opportunity
    //console.log(selectedValue);
    await fundingInfo(selectedValue);
    //Show all funding applications
    await displayFundingApplications(selectedValue, updateFunds);
});
  
  
/*  FUNCTION: This function is responsible for handling the rejection of applications to Funding Opportunities
*   PARAMS: FOName- this is the name of the Funding Opportunity
*           userID- is the ID of the user
*           fundID- this is the ID of the Funding Opportunity
*   Is a void function that deletes the application from Funding Opportunity and updates the application on the user side to rejected
*/
async function onRejectApplication(FOName, email){
  await onUserRejectApplication(FOName, email);
  await onFundignRejectApplication(FOName);
  await displayFundingApplications(FOName, updateFunds);
}



/*  FUNCTION: This function is responsible for handling the acceptance of applications to Funding Opportunities
*   PARAMS: FOName- this is the name of the Funding Opportunity
*           userID- is the ID of the user
*           fundID- this is the ID of the Funding Opportunity
*   Is a void function that updates the application from Funding Opportunity and  the application on the user side to accepted
*/
async function onAcceptApplication(name, email){
  await onUserAcceptApplication(name, email);
  await onFundingAcceptApplication(name, email);
  await displayFundingApplications(name, updateFunds); 
}



