require('./index.css');
require('normalize.css/normalize.css');

import React from 'react';
import Header from '../Header/';
import Main from '../../containers/Main';
import Footer from '../Footer/';

export default class App extends React.Component {
    render() {
        return <div id="dt-app">
            <Header/>
            <Main/>
            <Footer/>
        </div>;
    }
}
