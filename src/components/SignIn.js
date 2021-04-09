import React, { useState }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input, Modal } from '@material-ui/core';
import { auth } from '../firebase';
import '../App.css';

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

export default function SignIn({ openSignIn, onClose }) {

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
        <div>
            <Modal
        className="app__modal"
        open={openSignIn}
        onClose={onClose}
      >
      <div style={modalStyle} className={classes.paper}>
        <center>
          <h4 className="app__modalLabel">Log In</h4>
          <form className="app__signup">
            <Input
              className="app__modalInput"
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="app__modalInput"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Login</Button>
          </form>
        </center>
      </div>
      </Modal>
        </div>
    )
}
