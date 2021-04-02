import React from 'react'
import Avatar from "@material-ui/core/Avatar";
import './DisplayUser.css';

export default function DisplayUser({ username, name }) {
    return (
        <div className="app__user">
            <Avatar
                    className="user__avatar"
                    alt={username}
                    src="./avatar.jpg"
                />
                <h4 className="user__username">{username}</h4>
                <h5 className="user__name">{name}</h5>
        </div>
    )
}
