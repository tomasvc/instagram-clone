import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { auth } from '../../firebase/fbConfig';
import { Avatar } from '@material-ui/core';
import AddPost from '../dashboard/AddPost';
import '../../styles/Header.css';
import Skeleton from 'react-loading-skeleton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons'

import history from '../../history';

import UserContext from '../../user-context';

export default function Header({ user, userData }) {

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

    const onAddClose = () => {
        setOpenAdd(false)
    }

    const logout = () => {
      auth.signOut();
      history.push('/login');
    }
    

    return (
        <div>
        <AddPost openAdd={openAdd} onClose={onAddClose} user={user} />
        <div className="header">

          {window.innerWidth < 600 ?
            <div className="header__wrapper">
              <button className="nav__add-btn" onClick={ () => setOpenAdd(true) }>
                <FontAwesomeIcon width="26" height="26" icon={faPlusSquare} />
              </button>

              <a href="/"><img
              className="wrapper__logo"
              src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
              onClick={topFunction}
              /></a>

              <div id="navAvatarRing" className="nav__avatar-ring" style={
                  {width: '25px',
                  height: '25px', 
                  right: '17.5px', 
                  top: '13.5px',
                  border: '1px solid #262626'}
                }></div>
              
              { user ?
                <Avatar
                onClick={onOpenNavColumn}
                src={user?.photoURL}
                className="nav__avatar"
                style={{maxWidth: '22px'}}
                alt=""
              /> :
              <Skeleton width={22} height={22} />
            }
              

              <div id="navColumn" className="nav__column" style={{ display: "none", right: "-10px" }}>
                <div className="column__arrow"></div>
                  {
                    ( <div className="column__dropdown">
                        <a href={'/' + userData?.username}><button id="nav-btn" className="dropdown__profile">Profile</button></a>
                        <button id="nav-btn" className="dropdown__logout" onClick={logout}>Logout</button> 
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

            <a href="/"><svg id="navHomeBtn" className="nav__home-btn" fill="#262626" height="24" viewBox="0 0 48 48" width="24" onClick={topFunction}>
              <path d="M45.5 48H30.1c-.8 0-1.5-.7-1.5-1.5V34.2c0-2.6-2.1-4.6-4.6-4.6s-4.6 2.1-4.6 
              4.6v12.3c0 .8-.7 1.5-1.5 1.5H2.5c-.8 
              0-1.5-.7-1.5-1.5V23c0-.4.2-.8.4-1.1L22.9.4c.6-.6 1.6-.6 2.1 
              0l21.5 21.5c.3.3.4.7.4 1.1v23.5c.1.8-.6 1.5-1.4 1.5z" />
            </svg></a>

            { user?.displayName ?
              ( <button className="nav__add-btn" onClick={ () => setOpenAdd(true) }>
                  <FontAwesomeIcon icon={faPlusSquare} />
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
              {  
                ( <div className="column__dropdown">
                    <a href={'/' + userData?.username}><button id="nav-btn" className="dropdown__profile">Profile</button></a>
                    <button id="nav-btn" className="dropdown__logout" onClick={logout}>Logout</button> 
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
