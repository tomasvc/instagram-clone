import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../../firebase/config';
import './LoginPage.css';

export default function LoginPage() {

    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const login = async (event) => {

        event.preventDefault();

        try {

            await auth.signInWithEmailAndPassword(email, password)
                .then(authUser => {
                    if (authUser) {
                        history.push('/')
                    }
                })

        } catch (error) {
            setError(error.message)
        }
    
    }

    return (
        <div>

            <div className="wrapper">
                <div className="login">
                    <div className="login__logo"></div>
                    <p className="login__error">{error}</p>
                    <form onSubmit={login} className="login__form">
                        <input
                        className="form__input"
                        placeholder="Email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                        className="form__input"
                        placeholder="Password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="form__btn" type="submit" onSubmit={login}>Log In</button>
                    </form>
                </div>
                <div className="signup-link">
                    <p>Don't have an account?</p><a href="/signup">Sign up</a>
                </div>
                
            </div>

            <footer>
                <nav className="nav">
                    <a href="/login">About</a>
                    <a href="/login">Blog</a>
                    <a href="/login">Jobs</a>
                    <a href="/login">Help</a>
                    <a href="/login">API</a>
                    <a href="/login">Privacy</a>
                    <a href="/login">Terms</a>
                    <a href="/login">Top Accounts</a>
                    <a href="/login">Hashtags</a>
                    <a href="/login">Locations</a>
                </nav>

                <div className="copyright">
                    <p>&copy; 2021 Instagram clone not from Facebook | Created by <a href="https://github.com/tomasvc">tomasvc</a></p>
                </div>
            </footer>

        </div>
    )
}
