import React, { useState }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { auth } from '../../firebase/fbConfig';
import '../../styles/App.css';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      minWidth: '200px',
      backgroundColor: theme.palette.background.paper,
      border: 'none',
      borderRadius: '12px',
      outline: 0,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    }
  }));

export default function Login({ openSignIn, onClose }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const signIn = (event) => {
        event.preventDefault();
    
        auth
          .signInWithEmailAndPassword(email, password)
          .catch(error => alert(error.message))
    
        onClose();
    }

    return (
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
            <p>Don't have an account?</p><span>Sign up</span>
        </div>
        
    </div>
    )
}
