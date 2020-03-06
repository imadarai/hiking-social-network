import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './Welcome';
import App from "./app";



let component;
console.log(location.pathname);
if (location.pathname === "/welcome") {
    //render the registration page
    component = <Welcome />;

} else {
    //render the logo
    component = <p>logo</p>;
    //<App /> replace with Logo after done with Reser Pass

}


ReactDOM.render( component  , document.querySelector('main')
);
