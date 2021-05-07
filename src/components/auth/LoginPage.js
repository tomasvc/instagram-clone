import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../../firebase/fbConfig';
import '../../styles/LoginPage.css';

export default function LoginPage() {

    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const signIn = (event) => {
        event.preventDefault();
    
        auth
          .signInWithEmailAndPassword(email, password)
          .then(history.push("/"))
          .catch(error => {
              setError(error.message);
            })
    }

    return (
        <div>

            <div className="wrapper">
                <div className="login">
                    <div className="login__logo"></div>
                    <p className="login__error">{error}</p>
                    <form className="login__form">
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
                        <button className="form__btn" type="submit" onClick={signIn}>Log In</button>
                    </form>
                </div>
                <div className="signup-link">
                    <p>Don't have an account?</p><a href="/signup">Sign up</a>
                </div>
                
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
