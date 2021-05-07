import React, { useState }from 'react';
import { auth, db } from '../../firebase/fbConfig';
import '../../styles/App.css';

export default function SignUp({ openSignUp, onClose }) {

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
          console.log(authUser)
          db.collection('users').doc(authUser.user.uid).set({
            userId: authUser.user.uid,
            username,
            name,
            email,
            avatarUrl: '',
            following: 0,
            followers: 0,
            dateCreated: Date.now()
          })
          return authUser.user.updateProfile({
            displayName: username
          })
        })
        .catch((error) => alert(error.message))
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
            <p>Already have an account?</p><span>Log In</span>
        </div>

      </div>
    )
}
