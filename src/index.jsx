import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import dtApp from './reducers/evolve'
import App from './components/App/index';
import {setImageSrc} from './actions'
import ReactGA from 'react-ga';

ReactGA.initialize('UA-25289674-1');
// See https://github.com/react-ga/react-ga#usage if adding react-router
ReactGA.set({page: '/'});
ReactGA.pageview('/');


const store = createStore(
    dtApp,
    applyMiddleware(thunk)
);

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('react-app')
);

store.dispatch(setImageSrc('/img/marilyn.jpg'));

setTimeout(function () {
    window.onbeforeunload = function (e) {
        var msg = 'Are you sure you want to leave this page?';
        e.returnValue = msg; // most browsers
        return msg; // safari
    };
}, 1800000);
