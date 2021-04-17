import { combineReducers } from 'redux';
import authReducer from './authReducer';
import postReducer from './postReducer';
import getState from './createStore';
import { firestoreReducer } from 'redux-firestore';

const rootReducer = combineReducers({
    firestore: firestoreReducer,
    getState: getState,
    post: postReducer
})

export default rootReducer