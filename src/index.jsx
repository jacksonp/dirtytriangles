import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import dtApp from './reducers/evolve'
import App from './components/App';
import {setImageSrc} from './actions'

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
