import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../../firebase/fbConfig';
import firebase from 'firebase';
import './LoginPage.css';

export default function SignUpPage() {

    const history = useHistory();

    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signUp = (event) => {
        event.preventDefault();
    
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(authUser => {
          db.collection('users').doc(authUser.user.uid).set({
            userId: authUser.user.uid,
            username,
            name,
            email,
            password,
            avatarUrl: '',
            dateCreated: firebase.firestore.FieldValue.serverTimestamp()
          })
          authUser.user.updateProfile({
            displayName: username
          })
        })
        .then(history.push('/'))
        .catch((error) => setError(error))
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
                    <a href="/">About</a>
                    <a href="/">Blog</a>
                    <a href="/">Jobs</a>
                    <a href="/">Help</a>
                    <a href="/">API</a>
                    <a href="/">Privacy</a>
                    <a href="/">Terms</a>
                    <a href="/">Top Accounts</a>
                    <a href="/">Hashtags</a>
                    <a href="/">Locations</a>
                </nav>

                <div className="copyright">
                    <p>&copy; 2021 Instagram clone not from Facebook | Created by <a href="http://github.com/tomasvc">tomasvc</a></p>
                </div>
            </footer>

      </div>
    )
}
