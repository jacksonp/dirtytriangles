import React from 'react';
import Header from './Header';
import Main from '../containers/Main';
import About from './About';

export default class App extends React.Component {
    render() {
        return <div>
            <Header/>
            <Main/>
            <About/>
        </div>;
    }
}
