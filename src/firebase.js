import firebase from 'firebase';
import firestore from 'firebase/firestore';

const config = {
  apiKey: "AIzaSyDAMD7_FNdU0S6u7Yzyo5oo-TUVZND3B14",
  authDomain: "abasi-configurator.firebaseapp.com",
  databaseURL: "https://abasi-configurator.firebaseio.com",
  projectId: "abasi-configurator",
  storageBucket: "abasi-configurator.appspot.com",
  messagingSenderId: "90569062003"
};

firebase.initializeApp(config);

// Firebase
export default firebase;

// Auth
export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
export const Auth = firebase.auth();
export const DB = firebase.firestore();