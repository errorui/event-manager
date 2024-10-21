"use client"
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase"; 
const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signInGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result?.user);
    } catch (e) {
      console.log(e);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const signEmailPass = async (email, password, signup) => {
    if (signup) {
      await createUserWithEmailAndPassword(auth, email, password);
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
  };
  const createOrCheckUserDoc = async (currentUser) => {
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    
    const userData = {
        uid: currentUser.uid, 
        name: currentUser.displayName || "Anonymous",
        email: currentUser.email,
        profileImg: currentUser.photoURL || null,
        registeredEvents: [], 
        myEvents: [],
    };

    if (!userDocSnap.exists()) {
        await setDoc(userDocRef, userData); 
        return userData; 
    } else {
        const existingData = userDocSnap.data();
        return existingData; 
    }
};



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
       let Stored= await createOrCheckUserDoc(currentUser); 
        setUser(Stored);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  console.log(user)

  return (
    <AuthContext.Provider value={{ user, signOut, signInGoogle, signEmailPass, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => {
  return useContext(AuthContext);
};
