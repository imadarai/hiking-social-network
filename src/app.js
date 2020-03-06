// import React from 'react';
// import axios from "./axios";
//
//
//
// export default class App extends React.Component {
//     constructor (props) {
//         super (props);
//         this.state = {};
//
//     }
//
//     componentDidMount () {
//         axios.get('/user').then(
//             ({data}) => {
//                 this.setState(data);
//             }
//         )
//     }
//
//     render () {
//         if (!this.state.id) {
//             //some sort of test to see if an AJAX request is complete
//             return <img src="/progressbar.gif" alt = "loading...">;
//         }
//         return (
//             <div>
//                 <img src="/images/logo.png" alt ="logo">
//                 <ProfilePic
//                     first = {this.state.first}
//                     last = {this.state.last}
//                     url= {this.state.url}
//                     clickHandler = {() => this.setState({
//                         uploaderVisible: true
//                     })}
//                 />
//                 {this.state.uploaderVisible && <Uploader
//                     finishedUploading = {() => this.setState({
//                         image: newUrl
//                     })}
//                 />}
//             </div>
//         );
//     }
// }
