import React, { useState, useEffect } from 'react'
import { Avatar } from "@material-ui/core";
import { db } from '../../firebase/fbConfig';
import './Suggestions.css';

export default function Suggestions({ user, following }) {

    const [suggestions, setSuggestions] = useState([])

    useEffect(() => {
        const getSuggestions = () => {

            db
                    .collection('users')
                    .where('username', '!=', user?.displayName)
                    .get()
                    .then(querySnapshot => {
                        if (following === []) {
                           const result = querySnapshot.docs.map(item => ({
                               ...item.data()
                           }))

                           console.log(result)
                           setSuggestions(result)

                        } else {

                            let result

                            for (let i = 0; i < following?.length; i++) {
                                result = querySnapshot.docs.filter(item => item.data().username !== following[i].username)
                            }
                            let users = []

                            result?.forEach(item => {
                                users.push(item.data())
                            })
                            
                            console.log(users)
                            setSuggestions(users)

                        }
                    })
                    .catch(error => {
                        console.error(error)
                    })
                    
        }

        if (user) {
            getSuggestions()
        }

    }, [user, following])

    useEffect(() => {
        if (user && suggestions?.length > 0) {
            console.log(suggestions[0])
        }
        
        console.log(following)

    }, [suggestions, following])

    return (
        <div className="suggestions">
            <h4 className="suggestions__header">Suggestions For You</h4>
            <div className="suggestions__list">
            { suggestions.length > 0 ?
                suggestions.map(user => {
                    return <div className="list__user"><a href={'/' + user.username}><Avatar className="user__avatar" src={user.avatarUrl} /></a><div className="user__info"><a href={'/' + user.username}><p className="info__username">{user.username}</p></a><p className="info__suggestion">New to Instagram</p></div></div>
                })
              : 
              <p>None at the moment!</p>
            }
            <p className="suggestions__message">{suggestions && suggestions[0]?.username}</p>
            </div>
        </div>
    )
}
