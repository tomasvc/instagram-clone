import React, { useState } from 'react';
import { auth } from '../fbConfig';
import { Avatar } from '@material-ui/core';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import AddPost from './AddPost';
import './Header.css';

export default function Header({ user, userData }) {

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
        <div className="header">

          {window.innerWidth < 600 ?
            <div className="header__wrapper">
              <button className="nav__add-btn" onClick={ () => setOpenAdd(true) }>
                <svg viewBox="0 0 48 48" width="22" height="22">
                  <path stroke="#262626" fill="none" d="M30.1311,35.0978H17.8689c-2.74303,0-4.9667-2.22366-4.9667-4.9667V17.8689   
                  c0-2.74303,2.22367-4.9667,4.9667-4.9667H30.1311c2.74303,0,4.9667,2.22367,4.9667,4.9667V30.1311   
                  C35.0978,32.87414,32.87414,35.0978,30.1311,35.0978z"></path>
                </svg>
              </button>

              <a href="/"><img
              className="wrapper__logo"
              src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
              onClick={topFunction}
              /></a>

              <div id="navAvatarRing" className="nav__avatar-ring"></div>
              <Avatar
                onClick={onOpenNavColumn}
                src={userData.avatarUrl}
                className="nav__avatar"
                alt=""
              />

              <div id="navColumn" className="nav__column" style={{ display: "none" }}>
                <div className="column__arrow"></div>
                  { user?.displayName ? 
                  ( <div className="column__dropdown">
                      <a href={'/' + userData?.username}><button id="nav-btn" className="dropdown__profile">Profile</button></a>
                      <button id="nav-btn" className="dropdown__logout" onClick={() => auth.signOut()}>Logout</button> 
                    </div> )
                  :
                  ( <div className="column__dropdown">
                      <button id="nav-btn" className="dropdown__login" onClick={() => setOpenSignIn(true)}>Login</button>
                      <button id="nav-btn" className="dropdown__signup" onClick={() => setOpenSignUp(true)}>Sign Up</button>
                    </div> )
                  }
              </div>

            </div>

          :

          <div className="header__wrapper">
            <a href="/"><img
            className="wrapper__logo"
            src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
            onClick={topFunction}
          /></a>

          <div className="wrapper__search-container">
            <span className="search-container__icon"></span>
            <input className="search-container__input" placeholder="Search"></input>
          </div>
          
          <nav className="wrapper__nav">

            <a href="/"><svg id="navHomeBtn" className="nav__home-btn" fill="#262626" height="22" viewBox="0 0 48 48" width="22" onClick={topFunction}>
              <path d="M45.5 48H30.1c-.8 0-1.5-.7-1.5-1.5V34.2c0-2.6-2.1-4.6-4.6-4.6s-4.6 2.1-4.6 
              4.6v12.3c0 .8-.7 1.5-1.5 1.5H2.5c-.8 
              0-1.5-.7-1.5-1.5V23c0-.4.2-.8.4-1.1L22.9.4c.6-.6 1.6-.6 2.1 
              0l21.5 21.5c.3.3.4.7.4 1.1v23.5c.1.8-.6 1.5-1.4 1.5z" />
            </svg></a>

            { user?.displayName ?
              ( <button className="nav__add-btn" onClick={ () => setOpenAdd(true) }>
                <svg viewBox="0 0 48 48" width="22" height="22">
                  <path stroke="#262626" fill="none" d="M30.1311,35.0978H17.8689c-2.74303,0-4.9667-2.22366-4.9667-4.9667V17.8689   
                  c0-2.74303,2.22367-4.9667,4.9667-4.9667H30.1311c2.74303,0,4.9667,2.22367,4.9667,4.9667V30.1311   
                  C35.0978,32.87414,32.87414,35.0978,30.1311,35.0978z"></path>
                </svg>
              </button> 
              ): ('')
            }
            

            <div id="navAvatarRing" className="nav__avatar-ring"></div>
            <Avatar
              onClick={onOpenNavColumn}
              src={userData.avatarUrl}
              className="nav__avatar"
              alt=""
            />

          <div id="navColumn" className="nav__column" style={{ display: "none" }}>
            <div className="column__arrow"></div>
              { user?.displayName ? 
              ( <div className="column__dropdown">
                  <a href={'/' + userData?.username}><button id="nav-btn" className="dropdown__profile">Profile</button></a>
                  <button id="nav-btn" className="dropdown__logout" onClick={() => auth.signOut()}>Logout</button> 
                </div> )
              :
              ( <div className="column__dropdown">
                  <button id="nav-btn" className="dropdown__login" onClick={() => setOpenSignIn(true)}>Login</button>
                  <button id="nav-btn" className="dropdown__signup" onClick={() => setOpenSignUp(true)}>Sign Up</button>
                </div> )
              }
          </div>

          </nav>
          </div>
          }

        
      </div>
      </div>
    )
}
