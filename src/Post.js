import React from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar";

export default function Post({ username, caption, imageUrl }) {
    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src="./avatar.jpg"
                />
                <h4 className="post__username">{username}</h4>
            </div>
            
            <img className="post__image" src={imageUrl} alt="" />
            
            <h4 className="post__text"><span className="post__username">{username}</span> {caption}</h4>
        </div>
    )
}
