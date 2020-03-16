import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './welcome/Welcome';
import App from "./app/app";
///////////////////////////////////////////////////////////////////////////////
//                             REDUX MIDDLEWARE                               //
// /////////////////////////////////////////////////////////////////////////////
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from "./reducer";
const store = createStore(reducer,composeWithDevTools(applyMiddleware(reduxPromise)));
///////////////////////////////////////////////////////////////////////////////
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^REDUX MIDDLEWARE^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
// /////////////////////////////////////////////////////////////////////////////

let component;
console.log(location.pathname);
if (location.pathname === "/welcome") {
    //render the registration page
    component = <Welcome />;

} else {
    component = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render( component  , document.querySelector('main')
);
