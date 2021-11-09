import { useState, useEffect } from 'react';
import { auth } from './firebase/config';

// useAuthListener listens to user authentication and uses local storage
// to set the 'user' variable based on whether the user is logged in. 
// This way, the user doesn't have to login every time they visit the site

export function useAuthListener() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')));

  useEffect(() => {
    const listener = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        localStorage.setItem('authUser', JSON.stringify(authUser));
        setUser(authUser);
      } else {
        localStorage.removeItem('authUser');
        setUser(null);
      }
    });

    return () => listener();
  }, []);

  return { user };
}