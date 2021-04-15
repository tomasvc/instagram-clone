import React, { useState } from 'react';
import { auth } from '../firebase';
import { Avatar } from '@material-ui/core';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import AddPost from './AddPost';
import '../App.css';

export default function Header({ user }) {

    const [openSignIn, setOpenSignIn] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    
    const topFunction = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
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

    const onSignInClose = () => {
        setOpenSignIn(false)
    }

    const onSignUpClose = () => {
        setOpenSignUp(false)
    }

    const onAddClose = () => {
        setOpenAdd(false)
    }
    

    return (
        <div>
        
        <SignIn openSignIn={openSignIn} onClose={onSignInClose} />
        <SignUp openSignUp={openSignUp} onClose={onSignUpClose} />
        <AddPost openAdd={openAdd} onClose={onAddClose} user={user} />
        <div className="app__header">
        <div className="app__headerWrapper">
          <a href="/"><img
            className="app__headerImage"
            src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
            onClick={topFunction}
          /></a>

          <div className="app__searchContainer">
            <span className="app__searchIcon"></span>
            <input className="app__headerSearch" placeholder="Search"></input>
          </div>
          
          <nav className="app__nav">

            <a href="/"><svg id="navHomeBtn" className="app__navHomeBtn" fill="#262626" height="22" viewBox="0 0 48 48" width="22" onClick={topFunction}>
              <path d="M45.5 48H30.1c-.8 0-1.5-.7-1.5-1.5V34.2c0-2.6-2.1-4.6-4.6-4.6s-4.6 2.1-4.6 
              4.6v12.3c0 .8-.7 1.5-1.5 1.5H2.5c-.8 
              0-1.5-.7-1.5-1.5V23c0-.4.2-.8.4-1.1L22.9.4c.6-.6 1.6-.6 2.1 
              0l21.5 21.5c.3.3.4.7.4 1.1v23.5c.1.8-.6 1.5-1.4 1.5z" />
            </svg></a>

            { user?.displayName ?
              ( <button className="app__navAddBtn" onClick={ () => setOpenAdd(true) }>+</button> 
              ): ('')
            }
            

            <div id="navAvatarRing" className="app__navAvatarRing"></div>
            <Avatar
              onClick={onOpenNavColumn}
              className="app__navAvatar"
              alt=""
            />

          <div id="navColumn" className="app__navColumn" style={{ display: "none" }}>
            <div className="app__navColumnArrow"></div>
              { user?.displayName ? 
              ( <div className="app__loginContainer">
                  <a href="/user"><button className="app__navBtn">Profile</button></a>
                  <button className="app__navBtn" onClick={() => auth.signOut()}>Logout</button> 
                </div> )
              :
              ( <div className="app__loginContainer">
                  <a href="/user"><button className="app__navBtn">Profile</button></a>
                  <button className="app__navBtn" onClick={() => setOpenSignIn(true)}>Login</button>
                  <button className="app__navBtn" onClick={() => setOpenSignUp(true)}>Sign Up</button>
                </div> )
              }
          </div>

          </nav>

        </div>
      </div>
      </div>
    )
}
