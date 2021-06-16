import { useState, useEffect } from 'react';
import UserContext from './userContext';
import { auth } from './firebase/config';

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }
        })
    }, [])

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    )

}