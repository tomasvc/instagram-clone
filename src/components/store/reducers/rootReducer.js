import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import postReducer from './postReducer';
import getState from './createStore';
import { firestoreReducer } from 'redux-firestore';

const rootReducer = combineReducers({
    firestore: firestoreReducer,
    getState: getState,
    post: postReducer,
    user: userReducer
})

export default rootReducer