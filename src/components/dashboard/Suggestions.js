import React, { useState, useEffect } from 'react';
import { Avatar } from "@material-ui/core";
import { getSuggestions } from '../../firebase/fbFunctions';
import './Suggestions.css';

export default function Suggestions({ user, following }) {

    const [suggestions, setSuggestions] = useState([])

    useEffect(() => {
        
        async function suggestedProfiles() {
            const response = await getSuggestions(user, following)
            setSuggestions(response)
        }

        if (user && following) {
            suggestedProfiles()
        }

    }, [user, following])
    

    return suggestions?.length > 0 ? (
        <div className="suggestions">
            <div className="suggestions__top">
                <h4 className="top__header">Suggestions For You</h4>
                <a href="/suggestions" className="top__suggestions">See All</a>
                </div>
            <div className="suggestions__list">
            
                {suggestions.map(user => {
                    return <div className="list__user" key={suggestions.indexOf(user)}><a href={'/' + user.username}><Avatar className="user__avatar" src={user.avatarUrl} /></a><div className="user__info"><a href={'/' + user.username}><p className="info__username">{user.username}</p></a><p className="info__suggestion">New to Instagram</p></div></div>
                })}
            
            </div>
        </div>
        
    ) : ''
}
