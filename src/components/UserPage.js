import React from 'react';
import {Avatar, Button} from "@material-ui/core";
import './UserPage.css';

export default function UserPage({ user }) {
    return (
        <div className="user__main">

            <div className="user__top">
                <Avatar className="user__avatar"></Avatar>
                <div className="user__topRight">
                    <div>
                        <span className="user__username">{user ? user.displayName : "Username"}</span>
                        <button className="user__editBtn">Edit Profile</button>
                    </div>
                    <div className="user__topInfo">
                        <p className="user__info"><span className="user__infoNum">0</span> posts</p>
                        <p className="user__info"><span className="user__infoNum">0</span> followers</p>
                        <p className="user__info"><span className="user__infoNum">0</span> following</p>
                    </div>
                    <p className="user__name">Name</p>
                    <p className="user__description">Description</p>
                </div>
            </div>

            <div className="user__bottom">
                <nav className="user__nav">
                    <a className="active" href=".">Posts</a>
                    <a href="/user/igtv">IGTV</a>
                    <a href="/user/saved">Saved</a>
                    <a href="/user/tagged">Tagged</a>
                </nav>
            </div>
        </div>
    )
}
