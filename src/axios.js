import axios from 'axios';

var copy = axios.create({
    xsrfCookieName: 'mycsrftoken',
    xsrfHeaderName: 'csrf-token'
});

export default copy;
