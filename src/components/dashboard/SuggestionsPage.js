import React, { useState, useEffect, useContext } from 'react';
import { Avatar } from "@material-ui/core";
import { getSuggestions } from '../../firebase/fbFunctions';
import UserContext from '../../userContext';
import './SuggestionsPage.css';
import { toggleFollow, toggleUnfollow } from '../../firebase/fbFunctions';

export default function SuggestionsPage({ following }) {

    const { user } = useContext(UserContext)

    const [suggestions, setSuggestions] = useState([])

    const handleFollow = (event, selectedUser) => {

        if (event.target.classList.contains('item__followBtn')) {

            toggleFollow(user, selectedUser)
            
            event.target.classList.add('item__unfollowBtn')
            event.target.classList.remove('item__followBtn')
            event.target.innerHTML = 'Following'

        } else {

            toggleUnfollow(user, selectedUser)
            
            event.target.classList.add('item__followBtn')
            event.target.classList.remove('item__unfollowBtn')
            event.target.innerHTML = 'Follow'

        }
        
    }

    useEffect(() => {
        
        async function suggestedProfiles() {
            const response = await getSuggestions(user, following, 10)
            setSuggestions(response)
        }

        if (user && following) {
            suggestedProfiles()
        }

    }, [user, following])

    return (
        <div className="suggestionsWrapper">
            <h4 className="suggestionsWrapper__heading">Suggestions For You</h4>
            <div className="suggestionsPage">
                { suggestions && suggestions.map(suggestion => {
                    return <div className="suggestionsPage__item" key={suggestion.userId}>
                                <div className="item__left">
                                    <a href={'/' + suggestion.username}><Avatar className="item__avatar" src={suggestion.avatarUrl}></Avatar></a>
                                    <div className="item__names">
                                        <a href={'/' + suggestion.username}><p className="names__username">{suggestion.username}</p></a>
                                        <p className="names__fullName">{suggestion.name}</p>
                                    </div>
                                </div>
                                <button className="item__followBtn" onClick={(e) => handleFollow(e, suggestion)}>Follow</button>
                            </div>
                }) }
            </div>
        </div>
        
    )
}
