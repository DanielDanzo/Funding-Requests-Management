import {  db, auth, provider } from './init.js';
import {  collection, addDoc, getDocs,  query, where, orderBy, updateDoc, deleteDoc  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";




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



/*  FUNCTION: This function is responsible for handling the acceptance of applications to Funding Opportunities
*   PARAMS: FOName- this is the name of the Funding Opportunity
*           userID- is the ID of the user
*           fundID- this is the ID of the Funding Opportunity
*   Is a void function that updates the application from Funding Opportunity and  the application on the user side to accepted
*/
async function onFundingAcceptApplication(name, email){
  
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
      })
      .catch((error)=>{
        console.error("Error updating document: ", error)
      });
      
    } catch (e) {
      console.error("Error updating document: ", e);
    }
}



  /*  FUNCTION: This function is responsible for handling the rejection of applications to Funding Opportunities
  *   PARAMS: FOName- this is the name of the Funding Opportunity
  *           userID- is the ID of the user
  *           fundID- this is the ID of the Funding Opportunity
  *   Is a void function that deletes the application from Funding Opportunity and updates the application on the user side to rejected
  */
  async function onFundignRejectApplication(FOName, email){
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
}


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


export {
    addFundingApplication,
    getAllFundingApplications,
    onFundingAcceptApplication,
    onFundignRejectApplication
}