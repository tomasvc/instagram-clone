import React, { useContext } from 'react';
import DisplayUser from './DisplayUser';
import Suggestions from './Suggestions';
import UserContext from '../../userContext';
import './Sidebar.css';

export default function Sidebar({ following }) {

  const { user } = useContext(UserContext)

    return (
        <div className="app__sidebar">

            <DisplayUser className="DisplayUser" user={user} />

            <Suggestions className="Suggestions" user={user} following={following} />

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
            <h6 className="app__copyright">&copy; 2021 INSTAGRAM CLONE NOT FROM FACEBOOK. MADE BY TOMASVC</h6>
          </div>

        </div>
    )
}
