import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import firebase from 'firebase/app';
import './LoginPage.css';

export default function SignUpPage() {

    const history = useHistory();

    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signUp = async (event) => {
        event.preventDefault();

        setError('')

        try {

          // check if the username already exists in the database
          await db.collection('users').where('username', '==', username).get().then(user => {

            if (user.docs.length !== 0) {
              setError('An account with this username already exists')
            } else {

              const createUser = async () => {
                await auth
                  .createUserWithEmailAndPassword(email, password)
                  .then(async (authUser) => {
                    try {
                      db.collection('users').doc(authUser.user.uid).set({
                        userId: authUser.user.uid,
                        username,
                        name,
                        email,
                        password,
                        avatarUrl: '',
                        followers: 0,
                        following: 0,
                        dateCreated: firebase.firestore.FieldValue.serverTimestamp()
                      })
                        authUser.user.updateProfile({
                          displayName: username
                        })
                        history.push('/')
                    } catch (error) {
                      setError(error.message)
                    }
                  })
              }

              createUser()
                
              }
            })
          
        } catch (error) {
          setError(error.message)
        } 
        
    }

    return (
      <div className="wrapper">
        
        <div className="login">
            <div className="login__logo"></div>
            <p className="login__error">{error}</p>
            <form className="login__form">
            <input
                className="form__input"
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                 <input
                className="form__input"
                placeholder="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
                <input
                className="form__input"
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <input
                className="form__input"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <button className="form__btn" type="submit" onClick={signUp}>Sign Up</button>
            </form>
        </div>
        <div className="signup-link">
            <p>Already have an account?</p><a href="/login">Log In</a>
        </div>

        <footer>
                <nav className="nav">
                    <a href="/signup">About</a>
                    <a href="/signup">Blog</a>
                    <a href="/signup">Jobs</a>
                    <a href="/signup">Help</a>
                    <a href="/signup">API</a>
                    <a href="/signup">Privacy</a>
                    <a href="/signup">Terms</a>
                    <a href="/signup">Top Accounts</a>
                    <a href="/signup">Hashtags</a>
                    <a href="/signup">Locations</a>
                </nav>

                <div className="copyright">
                    <p>&copy; 2021 Instagram clone not from Facebook | Created by <a href="http://github.com/tomasvc">tomasvc</a></p>
                </div>
            </footer>

      </div>
    )
}
