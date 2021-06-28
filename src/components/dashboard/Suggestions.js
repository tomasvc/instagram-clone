import React, { useState, useEffect, useContext } from 'react';
import { Avatar } from "@material-ui/core";
import { getSuggestions } from '../../firebase/fbFunctions';
import UserContext from '../../userContext';
import './Suggestions.css';
import { toggleFollow } from '../../firebase/fbFunctions';

export default function Suggestions({ following }) {

    const { user } = useContext(UserContext)

    const [suggestions, setSuggestions] = useState([])

    useEffect(() => {
        
        async function suggestedProfiles() {
            const response = await getSuggestions(user, following, 5)
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
            
                {suggestions.map(suggestion => {
                    return <div className="list__user" key={suggestions.indexOf(suggestion)}>
                                <div className="user__left">
                                    <a href={'/' + suggestion.username}>
                                        <Avatar className="user__avatar" src={suggestion.avatarUrl} />
                                    </a>
                                    <div className="user__info">
                                        <a href={'/' + suggestion.username}>
                                            <p className="info__username">{suggestion.username}</p>
                                        </a>
                                        <p className="info__suggestion">New to Photogram</p>
                                    </div>
                                </div>
                                <button className="user__followBtn" onClick={() => toggleFollow(user, suggestion)}>Follow</button>
                            </div>
                })}
            
            </div>
        </div>
        
    ) : ''
}
