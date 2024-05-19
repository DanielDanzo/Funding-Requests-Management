import { getOrderedFungingOpportunity } from "../modules/funding.js";
import { addFundingApplication, getAllFundingApplications } from "../modules/fundingApplication.js";
import { getUserApplications, addUserApplication, allowUserApplication } from "../modules/userApplications.js";
import { uploadDoc } from "../modules/storage.js";
import { modal } from "./notifications.js";


const OPList = document.getElementById('opportunities-list');
const email = window.localStorage.getItem('email');
//const email ='sempapadaniel123@gmail.com';
const dropdown = document.getElementById('fundingId');
const statusList = document.getElementById('status-list');
const submitBtn = document.getElementById('submit-btn');
const files = document.getElementById('supportingDocuments');
var documents ;
var closingDate;
var applicationList;
var applications;

window.onload = await loadFundingApplications();
window.onload = await fundingDropDown(dropdown);
window.onload = await loadApplications(email);

/*  FUNCTION: This is a function that gets and displays all the Applications Associated with a Funding Opportunity
*   PARAMS: name-thia is the name of the funding opportunity you want to be displayed
*   The function updated FundingApplications array which will contain all the funding Opportunities
*/
async function loadFundingApplications(){
    applications = await getAllFundingApplications();
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
    dropdown.innerHTML = `<option value="Select">Select</option>`;
    //console.log(querySnapshot);
    const allFunds = await getOrderedFungingOpportunity();
    //console.log(allFunds);

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
    applicationList = await getUserApplications(email);
    displayAllApplications(statusList, applicationList,'applicationList');
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
    //console.log(closingDate);
    console.log(documents);
    await addUserApplication(email, closingDate, FOName);
    await addFundingApplication(FOName, email);

    documents.forEach(async (file, index)=>{
        await uploadDoc(file, file.name, email, FOName, index);
    });
    

    
}



submitBtn.addEventListener('click', async()=>{
    console.log('Hello');
    const FOName = dropdown.value;
    console.log(files.value);
    await applyForFundingOpportunity(FOName);
    modal(`Your application for ${FOName} is successful and will be reviewed`);
});



files.addEventListener('change', (event)=>{
    documents= [];
    for (let index = 0; index < event.target.files.length; index++) {
        documents.push(event.target.files[index]);
    }
    //documents = event.target.files; 
});
