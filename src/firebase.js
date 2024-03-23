import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
 apiKey: AIzaSyCJwV749i7icBPw9vjvTJ9B9iZkZCsdwAE,
  authDomain: react-song-app.firebaseapp.com,
  projectId: react-song-app,
  storageBucket: react-song-app.appspot.com,
  messagingSenderId: 217837909174,
  appId: 1:217837909174:web:3a0d37cac5c6f6ed032217,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
