import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
//REACTDOM.render is called only ONCE in your application





//class compenents CAN have state (data)
//function components CANNOT have state (data)
class HelloWorld extends React.Component {
    constructor (){
        super();
        this.state = {
            //IN REACT you don't have to create default values like VUE
            name: 'Imad',
        };
        //bind this in Constructor to the this in handleClick function
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        //lifecycle method - VUE moutned function
        //this is a good place to do axios requests to getch info from server!
        // axios.get('/user').then( results => {
        //     console.log(results);
        // });
        setTimeout(() => {
            //received a response from the server and store in this.state.
            this.setState({
                //take an object as an argument and you apss the properties you want to change
                name: "New Imad",
            }); //DO THIS to store information in State


        }, 2000);
    }

    handleClick () {
        console.log("handleClick running!");
        this.setState({
            name: "Imad from allSpice"
        });
    }


    render() {
        return (
            <div>
                <p className='headline'>Hello, World</p>
                <p onClick={this.handleClick}>I am a class component :)</p>
                <p>Hellow ...{this.state.name} ..</p>
                <p></p>
                <p></p>
                <User name={this.state.name}/>
            </div>
        );
    }
}

function User (props) {
    console.log("prop: ", props);
    return  <h1>{props.name}</h1>;
}


ReactDOM.render(
    <HelloWorld />,
    document.querySelector('main')
);
