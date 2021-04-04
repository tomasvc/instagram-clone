import './App.css';
import React, { useState, useEffect } from 'react'
import Post from './Post';
import DisplayUser from './DisplayUser';
import ImageUpload from './ImageUpload';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { auth, db } from './firebase';
import { Button, Input, Avatar } from '@material-ui/core';

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
    maxWidth: '80%',
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    borderRadius: '12px',
    outline: 0,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  mobile: {
    position: 'absolute',
    width: 200,
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    borderRadius: '12px',
    outline: 0,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}));

function App() {

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // useEffect runs a piece of code based on a specific condition
  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        setUser(authUser);
      } else {
        // user has logged out
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions before you refire the useEffect
      unsubscribe();
    }
  }, [user, username])

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then(authUser => {
      return authUser.user.updateProfile({
        displayName: username,
        name: name
      })
    })
    .catch((error) => alert(error.message))
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message))

    setOpenSignIn(false);
  }

  const onOpenNavColumn = () => {
    var column = document.getElementById("navColumn");
    var ring = document.getElementById("navAvatarRing");

    if (column.style.display === "none") {
      column.style.display = "block"
      ring.style.display = "inline"
    } else {
      column.style.display = "none"
      ring.style.display = "none"
    }
  }

  return (
    <div className="app">

      <Modal
        className="app__modal"
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
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

      <Modal
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}
      >
      <div style={modalStyle} className={window.innerWidth > 300 ? classes.paper : classes.mobile}>
        <center>
        <h4 className="app__modalLabel">Sign Up</h4>
          <form className="app__signup">
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

      <Modal 
        open={openAdd}
        onClose={() => setOpenAdd(false)}
      >
        <div style={modalStyle} className={window.innerWidth > 300 ? classes.paper : classes.mobile} >
          <center>
            <h4 className="app__modalLabel">Upload Image</h4>

            {user?.displayName ? (
              <ImageUpload username={user.displayName} setOpenAdd={setOpenAdd} />
            ):
              (<h4>You need to log in to upload</h4>)
            }
            
          </center>
        </div>
      </Modal>

      <div className="app__header">
        <div className="app__headerWrapper">
          <img
            className="app__headerImage"
            src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
          <input className="app__headerSearch" placeholder="Search"></input>

          <nav className="app__nav">

            <svg id="navHomeBtn" className="app__navHomeBtn" fill="#262626" height="22" viewBox="0 0 48 48" width="22">
              <path d="M45.5 48H30.1c-.8 0-1.5-.7-1.5-1.5V34.2c0-2.6-2.1-4.6-4.6-4.6s-4.6 2.1-4.6 
              4.6v12.3c0 .8-.7 1.5-1.5 1.5H2.5c-.8 
              0-1.5-.7-1.5-1.5V23c0-.4.2-.8.4-1.1L22.9.4c.6-.6 1.6-.6 2.1 
              0l21.5 21.5c.3.3.4.7.4 1.1v23.5c.1.8-.6 1.5-1.4 1.5z" />
            </svg>

            { user?.displayName ?
              ( <button className="app__navAddBtn" onClick={ () => setOpenAdd(true) }>+</button> 
              ): ('')
            }
            

            <div id="navAvatarRing" className="app__navAvatarRing"></div>
            <Avatar
              onClick={onOpenNavColumn}
              className="app__navAvatar"
              alt={username}
              src="src/avatar.jpg"
            />

          <div id="navColumn" className="app__navColumn" styles={{ display: "none" }}>
            <div className="app__navColumnArrow"></div>
              { user?.displayName ? 
              ( <button className="app__navBtn" onClick={() => auth.signOut()}>Logout</button> )
              :
              ( <div className="app__loginContainer">
                  <button className="app__navBtn" onClick={() => setOpenSignIn(true)}>Login</button>
                  <button className="app__navBtn" onClick={() => setOpenSignUp(true)}>Sign Up</button>
                </div> )
              }
          </div>

          </nav>

        </div>
      </div>

      <div className="app__globalWrapper">

        <div className="app__aside">
          { user?.displayUser ? (
            <DisplayUser user={user} name={name} />
          ) : (
            <DisplayUser username="Username" name="Name" />
          )

          }

          <div className="app__info">
            <ul className="app__menu">
                <li>About</li>
                <li>Help</li>
                <li>Press</li>
                <li>API</li>
                <li>Jobs</li>
                <li>Privacy</li>
                <li>Terms</li>
                <li>Locations</li>
                <li>Top Accounts</li>
                <li>Hashtags</li>
                <li>Language</li>
            </ul>
            <h6 className="app__copyright">&copy; 2021 INSTAGRAM NOT FROM FACEBOOK. MADE BY TOMASVC</h6>
          </div>

        </div>

        <div className="app__contentWrapper">

          <div className="app__stories"></div>

          <div className="app__postsWrapper">

          {
            posts.map(({id, post}) => {
              return <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            })
          }
          </div>

        </div> 

      </div>

    </div>
      
  );
}

export default App;
