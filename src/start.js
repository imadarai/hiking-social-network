import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './Welcome';



let component;
console.log(location.pathname);
if (location.pathname === "/welcome") {
    //render the registration page
    component = <Welcome />;

} else {
    //render the logo
    component = <p>logo</p>;

}


ReactDOM.render( component  , document.querySelector('main')
);
