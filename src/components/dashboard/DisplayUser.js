import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import Avatar from "@material-ui/core/Avatar";
import './DisplayUser.css';
import Skeleton from 'react-loading-skeleton';

export default function DisplayUser({ user }) {

    const [userData, setUserData] = useState(null);

    useEffect(() => {

        async function getUser() {
                await db
                .collection('users')
                .doc(user.uid)
                .get()
                .then(doc => {
                    setUserData(doc.data())
                }) 
        }

        if(user) {
            getUser()
        }

        return function cleanup() {
            setUserData(null)
        }
                
    }, [user])

    return (
        <div className="app__user">
            { userData ? 
            <a href={'/' + userData?.username} ><Avatar
                    className="displayUser__avatar"
                    alt=""
                    src={userData?.avatarUrl}
                /></a>
            :
            <Skeleton className="displayUser__avatar" circle width={50} height={50} />
            }
            <div>
                { userData ? <a href={'/' + userData?.username} className="displayUser__username">{userData?.username}</a> : <Skeleton width={150} height={15} /> }
                { userData ? <h5 className="displayUser__name">{userData?.name}</h5> : <Skeleton width={150} height={15} /> }
            </div>
        </div>
    )
}
