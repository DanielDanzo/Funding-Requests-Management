//import { getAuth, connectAuthEmulator, signInAnonymously } from 'firebase/auth';
import {
  ref,
  getDownloadURL,
  uploadBytesResumable
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js';
import { storage } from './init.js';
import { updateFundingURL } from './fundingApplication.js';
import { getUserURLs, updateUserURL } from './userApplications.js';

var URL;
var per = 0;

/*
*
*
*/
async function uploadDoc(file, fileName, email, FOName, index){
    const timeName = new Date().getTime() + fileName;
    const storageRef = ref(storage, timeName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
    (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        per = progress;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
        case 'paused':
            console.log('Upload is paused');
            break;
        case 'running':
            console.log('Upload is running');
            break;
        default:
            break;
        }
    }, 
    (error) => {
        console.error(error)
    }, 
     () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log('File available at', downloadURL);
            await updateFundingURL(email, FOName, index, downloadURL);
            await updateUserURL(email, FOName, index, downloadURL);
        });
    }
  );
}



/*
*
*
*/
async function getDocuments(name,email){
    const URLs = await getUserURLs(name, email);
    console.log(URLs);
    // This can be downloaded directly:
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      const blob = xhr.response;
    };
    xhr.open('GET', URLs[0]);
    xhr.send();
}



export {uploadDoc, getDocuments}