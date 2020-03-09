import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './welcome/Welcome';
import App from "./app/app";



let component;
console.log(location.pathname);
if (location.pathname === "/welcome") {
    //render the registration page
    component = <Welcome />;

} else {
    component = <App />;
}


ReactDOM.render( component  , document.querySelector('main')
);
