import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiqI3elWnfJ2_7j4IMthgrB9WZdO_V19s",
  authDomain: "bootscootnjuke.firebaseapp.com",
  databaseURL: "https://bootscootnjuke-default-rtdb.firebaseio.com",
  projectId: "bootscootnjuke",
  storageBucket: "bootscootnjuke.appspot.com",
  messagingSenderId: "726846433458",
  appId: "1:726846433458:web:9b6f1d69011770055681ab",
  measurementId: "G-Y2LJHGGFJF",
};

export const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
export const logosRef = ref(storage, "logos");

export const db = getFirestore();
