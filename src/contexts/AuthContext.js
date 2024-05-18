import React, { useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = React.createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      return userCredential.user.getIdToken().then((token) => {
        localStorage.setItem('token', token);
      });
    });
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      return userCredential.user.getIdToken().then((token) => {
        localStorage.setItem('token', token);
      });
    });
  }

  function getToken() {
    return localStorage.getItem('token');
  }

  function logout() {
    return signOut(auth).then(
      () => {
        localStorage.removeItem('token');
      },
      (error) => {
        console.error(error);
        return Promise.reject(error);
      }
    );
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  });

  const value = {
    currentUser,
    signup,
    login,
    getToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
