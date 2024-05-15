import {db, auth, provider} from './init.js';
import { collection, addDoc, getDocs, doc, query, where, orderBy  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";




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


/*  FUNCTION: This is a function that displays all the Applications Associated with a Funding Opportunity
*   PARAMS: name-thia is the name of the funding opportunity you want to be displayed
*   The function updated FundingApplications array which will contain all the funding Opportunities
*/
async function getAllFundingApplications(){
    //console.log('Entered');
    const userRef = query(collection(db, 'Funding Opportunity'), orderBy("ClosingDate", "desc"));
    const namesQuerySnapshot = await getDocs(userRef);

    const applications = [];
    if(namesQuerySnapshot.empty){
        return applications;
    }

    //sort according to pending and approved after adding
    namesQuerySnapshot.forEach((doc) => {
        applications.push(doc.data());
    });

    return applications;
}

export {
    addFundingApplication,
    getAllFundingApplications
}