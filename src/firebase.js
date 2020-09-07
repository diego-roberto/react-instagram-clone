import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCvAXyNAZmAgt99pbSuw0t9QjbWIlvf9rQ",
    authDomain: "instagram-clone-react-d.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-d.firebaseio.com",
    projectId: "instagram-clone-react-d",
    storageBucket: "instagram-clone-react-d.appspot.com",
    messagingSenderId: "698591224547",
    appId: "1:698591224547:web:1171dc1d08b97ade951bd6",
    measurementId: "G-WJ8DPMW6LK"    
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };