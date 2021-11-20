//this contains the firebase context and provider
import React, { createContext} from "react";
// import firebaseConfig from "./firebaseConfig";
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "@firebase/analytics";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import {
  getDatabase,
  ref
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC6rWX23LA2pdSTMAcptLvLDsxRLk4buZg",
  authDomain: "cs385-fitness-app.firebaseapp.com",
  databaseURL: "https://cs385-fitness-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cs385-fitness-app",
  storageBucket: "cs385-fitness-app.appspot.com",
  messagingSenderId: "392827482682",
  appId: "1:392827482682:web:4c50bcdbbf7e1dabfefb03",
  measurementId: "G-NEY42M2JF1"
};

const FirebaseContext = createContext(null);
export { FirebaseContext };

export default ({ children }) => {
  let firebase = {
    app: null,
    auth: null,
    authCredential: null,
    user: null,
    database: null,
    analytics: null,
  };

  //check if firebase app has been init
  if (!getApps.length) {
    const app = initializeApp(firebaseConfig);
    
    const auth = getAuth();
    const analytics = getAnalytics(app);
    // console.log(auth);
    firebase = {
      app: app,
      auth: auth,
      authCredential: null,
      user: null,
      database: getFirestore(app),
      analytics: analytics,
      api: {
        
      }
    };
  }
  
  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
};