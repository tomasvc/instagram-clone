import React, { useState, useEffect } from 'react';
import { Avatar } from "@material-ui/core";
import { db } from '../fbConfig';
import './Profile.css';

export default function UserPage({ user }) {

    const [userData, setUserData] = useState([]);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        if (user) {
                db
                .collection('users')
                .doc(user.uid)
                .get()
                .then(doc => {
                    setUserData(doc.data())
                }) 
        }
    }, [user])

    useEffect(() => {
        if (user) {
            const snapshot = db.collection('posts').where('username', '==', user.displayName).get();
            if (!snapshot.exists) {
                console.log("No matching documents");
                return
            } else {
                snapshot.forEach(doc => {
                    console.log(doc.id)
                })
            }
        }
    }, [user])

    

    return (
        <div className="user__main">
            <div className="user__top">
                <Avatar src={ userData?.avatarUrl } className="user__avatar"></Avatar>
                <div className="user__topRight">
                    <div>
                        <span className="user__username">{ user && userData.username }</span>
                        <a href="/user/edit" className="user__editBtn">Edit Profile</a>
                    </div>
                    <div className="user__topInfo">
                        <p className="user__info"><span className="user__infoNum">{ user && userData.posts?.length }</span> posts</p>
                        <p className="user__info"><span className="user__infoNum">{ user && userData.followers }</span> followers</p>
                        <p className="user__info"><span className="user__infoNum">{ user && userData.following }</span> following</p>
                    </div>
                    <p className="user__name">{ user && userData.name }</p>
                    <p className="user__bio">{ user && userData.bio }</p>
                    <a href={userData.website} className="user__website">{ user && userData.website }</a>
                </div>
            </div>

            <div className="user__bottom">
                <nav className="user__nav">
                    <a className="active" href=".">Posts</a>
                    <a href="/user">IGTV</a>
                    <a href="/user">Saved</a>
                    <a href="/user">Tagged</a>
                </nav>
            </div>
        </div>
    )
}
