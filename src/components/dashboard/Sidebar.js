import React from 'react';
import DisplayUser from './DisplayUser';

export default function Sidebar({ user }) {
    return (
        <div className="app__sidebar">

            <DisplayUser user={user} />

          

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
