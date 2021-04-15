import { createStore, compose } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';

// import root reducer
import rootReducer from './reducers/index';

// const defaultState = {
//     posts,
//     comments
// };

//export const store = createStore(rootReducer, defaultState);

//export const history = syncHistoryWithStore(browserHistory, store);