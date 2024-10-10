import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA7b5ZrtiCOJpp5vsn8etqBpq0ihTqslUs",
  authDomain: "peoplepixel.firebaseapp.com",
  projectId: "peoplepixel",
  storageBucket: "peoplepixel.appspot.com",
  messagingSenderId: "214553984536",
  appId: "1:214553984536:web:fc3d819ff491d9dd32cd6d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage(app);
export const auth = getAuth(app);
export { db,storage };