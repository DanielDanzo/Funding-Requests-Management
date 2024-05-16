import {db, auth, provider} from './init.js';
import { collection, addDoc, getDocs, doc, query, where, orderBy  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";





/*  FUNCTION: gets and displays all the applications of a applicant
*
*
*/
async function getUserApplications(email){
    try {
        const userRef = query(collection(db, 'users'), where('Email', '==', email));
        const appSnapshot = await getDocs(userRef);
  
        // Reference to the subcollection
        console.log(appSnapshot);
        const applicationsRef = query(collection(appSnapshot.docs[0].ref, 'Applications'), orderBy('Status', 'asc'));
        const querySnapshot = await getDocs(applicationsRef);

        const applicationList = [];
        querySnapshot.forEach((doc)=>{
            applicationList.push(doc.data());
        });
        return applicationList;

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
        const userRef = query(collection(db, 'users'), where('Email', '==', email));
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



  /*  FUNCTION: This function is responsible for handling the rejection of applications to Funding Opportunities
  *   PARAMS: FOName- this is the name of the Funding Opportunity
  *           userID- is the ID of the user
  *           fundID- this is the ID of the Funding Opportunity
  *   Is a void function that deletes the application from Funding Opportunity and updates the application on the user side to rejected
  */
async function onUserRejectApplication(FOName, email){
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
      })
      .catch((error)=>{
        console.error("Error updating document: ", error)
      });
      
    } catch (e) {
      console.error("Error updating document: ", e);
    }
}



/*  FUNCTION: This function is responsible for handling the acceptance of applications to Funding Opportunities
*   PARAMS: FOName- this is the name of the Funding Opportunity
*           userID- is the ID of the user
*           fundID- this is the ID of the Funding Opportunity
*   Is a void function that updates the application from Funding Opportunity and  the application on the user side to accepted
*/
async function onUserAcceptApplication(name, email){
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
}



export {
    getUserApplications,
    addUserApplication,
    allowUserApplication,
    onUserRejectApplication,
    onUserAcceptApplication
}