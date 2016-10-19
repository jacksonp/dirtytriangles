import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import dtApp from './reducers/evolve'
import App from './components/App';

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
