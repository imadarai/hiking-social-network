import React, {useState} from 'react';
import axios from "./axios";


export default function useAuthSubmit(url, values) {

    const [error, setError] = useState();

    const handleSubmit = () => {
        axios
            .post(url, values)
            .then( ({data}) => {
                if (!data.success){
                    setError(true);
                } else {
                    location.replace('/');
                }
            }).catch(err =>{
                console.log("err in /login post request is: ", err);
                setError(true);
            });
    };
    return [error, handleSubmit];

}
