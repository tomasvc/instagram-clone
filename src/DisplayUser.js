import React from 'react'
import Avatar from "@material-ui/core/Avatar";
import './DisplayUser.css';

export default function DisplayUser({ user, name }) {
    return (
        <div className="app__user">
            <Avatar
                    className="user__avatar"
                    alt=""
                    src="./img/avatar.jpg"
                />
            <div>
                <h4 className="user__username">{user?.displayName}</h4>
                <h5 className="user__name">{name}</h5>
            </div>
        </div>
    )
}
