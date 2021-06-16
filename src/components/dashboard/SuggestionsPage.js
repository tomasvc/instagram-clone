import React, { useState, useEffect } from 'react';
import { Avatar } from "@material-ui/core";
import { getSuggestions } from '../../firebase/fbFunctions';
import './SuggestionsPage.css';

export default function SuggestionsPage({ user, following }) {

    const [suggestions, setSuggestions] = useState([])

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
            <h4 className="wrapper__heading">Suggested</h4>
            <div className="suggestionsPage">
                { suggestions && suggestions.map(suggestion => {
                    return <div className="suggestionsPage__item" key={suggestions.indexOf(suggestion)}>
                        <a href={'/' + suggestion.username}><Avatar className="item__avatar" src={suggestion.avatarUrl}></Avatar></a>
                        <a href={'/' + suggestion.username}><p className="item__username">{suggestion.username}</p></a>
                    </div>
                }) }
            </div>
        </div>
        
    )
}
