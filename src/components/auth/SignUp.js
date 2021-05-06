import React, { useState }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input, Modal, Avatar } from '@material-ui/core';
import { auth, db } from '../../firebase/fbConfig';
import { useDispatch } from 'react-redux';
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

export default function SignUp({ openSignUp, onClose }) {

    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    let avatarUrl = ''

    const signUp = (event) => {
        event.preventDefault();
    
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(authUser => {
          console.log(authUser)
          //dispatch(createUser({ username, name, avatarUrl, website, bio }))
          db.collection('users').doc(authUser.user.uid).set({
            userId: authUser.user.uid,
            username,
            name,
            email,
            avatarUrl,
            following: 0,
            followers: 0,
            posts: [],
            dateCreated: Date.now()
          })
          return authUser.user.updateProfile({
            displayName: username
          })
        })
        .catch((error) => alert(error.message))
    }

    return (
        <div>
            <Modal
        className="app__modal"
        open={openSignUp}
        onClose={onClose}
      >
      <div style={modalStyle} className={classes.paper}>
        <center>
        <h4 className="app__modalLabel">Sign Up</h4>
          <form className="app__signup">
            <Avatar className="app__signup__avatar"></Avatar>
            <input type="file" hidden />
            <Input
              className="app__modalInput"
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              className="app__modalInput"
              placeholder="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </center>
      </div>
      </Modal>
        </div>
    )
}
