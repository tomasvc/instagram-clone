import React from 'react'
import Avatar from "@material-ui/core/Avatar";
import './DisplayUser.css';

export default function DisplayUser({ user, name }) {
    return (
        <div className="app__user">
            <a href="/user" ><Avatar
                    className="displayUser__avatar"
                    alt=""
                    src="./img/avatar.jpg"
                /></a>
            <div>
                <a href="/user" className="displayUser__username">{user?.displayName}</a>
                <h5 className="displayUser__name">{name}</h5>
            </div>
        </div>
    )
}
