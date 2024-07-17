// src/firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAdZgv6JsNkuN8-R8R9ua7GOnJlXNErzus",
    authDomain: "westernflex-9095b.firebaseapp.com",
    projectId: "westernflex-9095b",
    storageBucket: "westernflex-9095b.appspot.com",
    messagingSenderId: "804487525715",
    appId: "1:804487525715:web:6c691b6820b942d137dda6"
   
  };

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export default firebase;
