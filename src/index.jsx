import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk';
import dtApp from './reducers/evolve'
import App from './components/App/index';
import {setImageSrc} from './actions'

const store = createStore(
    dtApp,
    applyMiddleware(thunk)
);

createRoot(document.getElementById('react-app')).render(
    <Provider store={store}>
        <App/>
    </Provider>
);

store.dispatch(setImageSrc('/img/churchill.jpg'));

setTimeout(function () {
    window.onbeforeunload = function (e) {
        var msg = 'Are you sure you want to leave this page?';
        e.returnValue = msg; // most browsers
        return msg; // safari
    };
}, 1800000);
