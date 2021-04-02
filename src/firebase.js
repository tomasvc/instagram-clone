import firebase from "firebase"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAG8EdlmeN-phVHYiKlQcAm5QLjd74xEQg",
    authDomain: "instagram-7664b.firebaseapp.com",
    projectId: "instagram-7664b",
    storageBucket: "instagram-7664b.appspot.com",
    messagingSenderId: "698410839849",
    appId: "1:698410839849:web:7470049fe022a7b3729138",
    measurementId: "G-ELVW7EG096"
};


const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };