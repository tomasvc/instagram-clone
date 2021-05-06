import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/fbConfig';
import Avatar from "@material-ui/core/Avatar";
import '../../styles/DisplayUser.css';

export default function DisplayUser({ user }) {

    const [userData, setUserData] = useState([]);

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

    return (
        <div className="app__user">
            <a href={'/' + userData?.username} ><Avatar
                    className="displayUser__avatar"
                    alt=""
                    src={userData?.avatarUrl}
                /></a>
            <div>
                <a href={'/' + userData?.username} className="displayUser__username">{user?.displayName}</a>
                <h5 className="displayUser__name">{userData?.name}</h5>
            </div>
        </div>
    )
}
