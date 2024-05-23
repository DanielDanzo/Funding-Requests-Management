import {db} from '../modules/init.js';
import { collection, getDocs, query, where, orderBy  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getOrderedFungingOpportunity, getAllFundingApplications } from "../modules/funding.js";
import { onUserRejectApplication, onUserAcceptApplication } from "../modules/userApplications.js";
import { onFundingAcceptApplication, onFundignRejectApplication } from "../modules/fundingApplication.js";
import { modal } from "./notifications.js";
import { getAndVerifyEmail } from '../modules/security.js';

let selectedValue;
let fundWithApplicants = -1;

const dropdown = document.getElementById("funds");
let updateFunds = document.getElementById("updateFund");
let genButton = document.getElementById("generate");
let customButton = document.getElementById("customButton");
let applications = [];
let name;

//When page is loaded do this
window.onload = await getAndVerifyEmail('Fund Manager');
window.onload = await fundingDropDown(document.getElementById("funds"));

// Function to generate a PDF, where length determines the number of "sections" in this document
function downloadPDF(length) {
    const { jsPDF } = window.jspdf; // Ensure jsPDF is loaded
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let pageOffset = 20;

    doc.setFont("times", "bold");
    doc.setFontSize(25);
    doc.setTextColor(0, 0, 255);
    doc.text("Loyal Funding", 20, 20);

    doc.setFont("times", "normal");
    doc.setFontSize(21);
    doc.setTextColor(0,0,0);
    doc.text(`${name} Report`, 30, pageOffset + 20);
    
    doc.setFontSize(16);
    let startingPoint = 60; // Adjust to start below the title

    if (length === -1) {
        console.log("No downloading");
        return;
    } else if (length === 0) {
        doc.text("This fund has no applications as of yet.", 20, startingPoint);
    } else {
        for (let i = 0; i < length; i++) {
            if (startingPoint + 30 > pageHeight - 20) { // -20 to provide margin at the bottom
                doc.addPage();
                startingPoint = 20; // Reset startingPoint after adding a new page
            }
            PDFparagraphs(doc, i, startingPoint);
            startingPoint += 40; // Increment starting point for the next section
        }
    }

    doc.save(`${name} Report.pdf`);
}
//creates paragraphs in the downloadPDF paragraph
function PDFparagraphs(doc, i, pageOffset) {
    let email = applications[i].Email;
    let status = applications[i].Status;
    let date = applications[i].submitDate;
    doc.text(`Applicant email: ${email}`, 20, pageOffset);
    doc.text(`Application status: ${status}`, 20, pageOffset + 10);
    doc.text(`Date of application: ${date}`, 20, pageOffset + 20);
}

// Function to generate a PDF containing paragraphs based on funds data
async function generatePDFFromFunds(funds) {
    const { jsPDF } = window.jspdf; // Ensure jsPDF is loaded
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let pageOffset = 20;

    doc.setFont("times", "bold");
    doc.setFontSize(25);
    doc.setTextColor(0, 0, 255); // Set color to blue
    doc.text("Loyal Funding", 20, 20);

    doc.setFontSize(21);
    doc.setTextColor(0,0,0);
    doc.text(`Funding Opportunity Report`, 50, pageOffset + 20);

    doc.setFontSize(13);
    doc.setFont("times", "normal");

    pageOffset = 60;

    // Loop through funds data and add paragraphs to the PDF
    for (let i = 0; i < funds.length; i++) {
        // Check if the current paragraph exceeds the page height
        if (pageOffset + 30 > pageHeight - 20) { // -20 to provide margin at the bottom
            doc.addPage();
            pageOffset = 20; // Reset page offset after adding a new page
        }
        PDFFundParagraphs(doc, funds[i], pageOffset);
        pageOffset += 80; // Increment page offset for the next section
    }

    doc.save("Funds Report.pdf");
}

// Function responsible for adding a paragraph to the PDF document
function PDFFundParagraphs(doc, fund, startingPoint) {
    let name = fund.Name;
    let closingDate = fund.ClosingDate;
    let description = fund.Description;
    let suitableCandidates = fund.SuitableCandidates;
    let type = fund.Type;
    let applicantFund = fund.ApplicantFund;
    let estFund = fund.EstimatedFunds;

    // Add data to the PDF document
    doc.text(`Name: ${name}`, 20, startingPoint);
    doc.text(`Closing Date: ${closingDate}`, 20, startingPoint + 10);
    doc.text(`Description: ${description}`, 20, startingPoint + 20);
    doc.text(`Suitable Candidates: ${suitableCandidates}`, 20, startingPoint + 30);
    doc.text(`Type: ${type}`, 20, startingPoint + 40);
    doc.text(`Applicant Fund: R${applicantFund}`, 20, startingPoint + 50);
    doc.text(`Estimated Fund: R${estFund}`, 20, startingPoint + 60);
}


//allows PDF download of information related to chosen funding opportunity
genButton.addEventListener("click", async () => {
    // Assuming length is the number of applications
    await updateApplications(selectedValue);

    applications.sort((str1, str2)=>{
        if (str1.Status ==='Pending' && str2.Status==='Approved') {
            return -1;
        } else if (str1.Status==='Approved' && str2.Status==='Pending') {
            return 1;
        } else {
            return 0;
        }
    });

    modal(`${name} Report has been downloaded.`);
    downloadPDF(applications.length);
});

//Works downloadPDF, but for funding opportunity.
customButton.addEventListener('click', async () => {
    const allFunds = await getFundingOpportunity();
    console.log(allFunds);
    modal(`Funding report has been downloaded.`);
    generatePDFFromFunds(allFunds);
})

/*  FUNCTION: Gets all the funding opportunities in the database and adds them to the dropdown menu
*
*
*/
async function fundingDropDown(dropdown){
    dropdown.innerHTML = `<option value="Select">Select</option>`; //USE THIS FOR THE GENERAL REPORT!!!
    const allFunds = await getOrderedFungingOpportunity();

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

/*Fetches all data related to funding opportunities currently present*/
async function getFundingOpportunity(){
    const querySnapshot = await getDocs(collection(db, "Funding Opportunity"), where('Status', '==','Approved'),orderBy("Name"));
      const allFunds = [];
    
      //results from database
      querySnapshot.forEach((doc)=>{
          allFunds.push(doc.data());
      });
    
      return allFunds;
    }

/*  FUNCTION: This is a function that updates the applicants array depending
*   on the chosen funding opportunity.
*   PARAMS: name-this is the name of the funding opportunity you want to be displayed
*/
async function updateApplications(name){
  applications = await getAllFundingApplications(name);
  if(applications.length === 0){
    applications = [];
    return;
  }
}



dropdown.addEventListener('change', async () => {
    selectedValue = dropdown.value;
    name = selectedValue;
    await updateApplications(selectedValue);
});
  
  
/*  FUNCTION: This function is responsible for handling the rejection of applications to Funding Opportunities
*   PARAMS: FOName- this is the name of the Funding Opportunity
*           userID- is the ID of the user
*           fundID- this is the ID of the Funding Opportunity
*   Is a void function that deletes the application from Funding Opportunity and updates the application on the user side to rejected
*/
async function onRejectApplication(FOName, email){
  await onUserRejectApplication(FOName, email);
  await onFundignRejectApplication(FOName)
  await getAllFundingApplications(FOName, updateFunds);
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
  await getAllFundingApplications(name, updateFunds); 
}
