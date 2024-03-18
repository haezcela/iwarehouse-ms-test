/*import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
/*import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
*/
/*
import {
  getFirestore,
  collection,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
*/
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  orderBy,
  getDocs,
  where,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBvrH8L6EuM8MfAD0HSmD_vaAcqWxO1cXs",
  authDomain: "iwarehouse-8ac76.firebaseapp.com",
  projectId: "iwarehouse-8ac76",
  storageBucket: "iwarehouse-8ac76.appspot.com",
  messagingSenderId: "778867729477",
  appId: "1:778867729477:web:18f5ca5b5fd6e81f78ef2c",
  measurementId: "G-TNR0NW84YB",
});

/*USER AUTHENTICATION */
const auth = getAuth(firebaseApp);
export {
  auth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
};
/*DATABASE */
const db = getFirestore(firebaseApp);
export {
  db,
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  orderBy,
  where,
};

/*STORAGE */
const storage = getStorage(firebaseApp);
export { storage, ref, uploadBytes, getDownloadURL };
