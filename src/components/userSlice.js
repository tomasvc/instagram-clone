import React from 'react'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    username: 'Username',
    name: 'Name',
    avatar: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsername: (state, username) => {
            state.username = username
        }
    }
})
