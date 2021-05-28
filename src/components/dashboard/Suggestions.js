import React, { useState, useEffect } from 'react'
import { Avatar } from "@material-ui/core";
import { db } from '../../firebase/fbConfig';
import './Suggestions.css';

export default function Suggestions({ user, following }) {

    const [suggestions, setSuggestions] = useState([])

    useEffect(() => {

        const getSuggestions = async () => {

            await db
                .collection('users')
                .where('username', '!=', user?.displayName)
                .get()
                .then(querySnapshot => {

                    let alreadyFollowing = []  // contains names of people the user is already followinig
                    let result = [] // contains query result of people the user is NOT following
                    let users = [] // contains objects of each user extracted from result
                    
                        // find all users that the current user is already following
                        querySnapshot.docs.forEach(item => {

                            for (let i = 0; i < following.length; i++) {
                                if (item.data().username === following[i].username && !alreadyFollowing.includes(item.data().username)) {
                                    alreadyFollowing?.push(item.data().username)  
                                }
                            }

                        })

                        // get query result of users that the current user is NOT following
                        result = querySnapshot.docs.filter(item => {
                            return !alreadyFollowing.includes(item.data().username)
                        })

                        // extract object data from result and store in users array, maximum 5 users
                        if (result.length > 5) {
                            for (let i = 0; i < 5; i++) {
                                users?.push(result[i].data())
                            }
                        } else {
                            result.forEach(user => {
                                users?.push(user.data())
                            })
                        }
                    
                    setSuggestions(users)

                })
                .catch(error => {
                    console.error(error)
                })
                    
        }

        if (user && following) {
            getSuggestions()
        }

    }, [user, following])
    

    return (
        <div className="suggestions">
            <h4 className="suggestions__header">Suggestions For You</h4>
            <div className="suggestions__list">
            { suggestions?.length > 0 ?
                suggestions.map(user => {
                    return <div className="list__user" key={suggestions.indexOf(user)}><a href={'/' + user.username}><Avatar className="user__avatar" src={user.avatarUrl} /></a><div className="user__info"><a href={'/' + user.username}><p className="info__username">{user.username}</p></a><p className="info__suggestion">New to Instagram</p></div></div>
                })
              : 
              <p className="suggestions__none">None at the moment!</p>
            }
            </div>
        </div>
    )
}
