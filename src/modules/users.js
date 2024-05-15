const db = require('./init.js');


//Function to check if user is registered
async function verifyRole(email, role){
    try {
        console.log('Verifying role.....');
        const q = query(collection(db, 'users'), where('Email', '==', email), where('Role', '==',role));
        const querySnapshot = await getDocs(q);
        console.log('Role Snapshot: ', querySnapshot);
        if(querySnapshot.empty){
            return false;
        }
        return true;
      } catch (error) {
        console.error(error);
      }
}


//Function to check if user is registered
async function verifyUser(email){
    try {
        console.log('Verifying email.....');
        console.log(email);
        const q = query(collection(db, 'users'), where('Email', '==', email));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        console.log('Docs: ',querySnapshot.docs);
        console.log('Empty: ', querySnapshot.empty);
        console.log('Snapshot: ', querySnapshot.docs.empty );
        if(querySnapshot.empty){
            return false;
        }
        return true;
      } catch (error) {
        console.error(error);
      }
}





module.export = {
    verifyRole,
    verifyUser
};