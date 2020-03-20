import React from "react";
import axios from "../axios";

export default function({ id, updateImage, closeUploaderModal }) {
    function readFile(e) {
        const file = e.target.files[0];
        var formData = new FormData();
        formData.append("id", id);
        formData.append("file", file);
        submit(formData);
    }
    async function submit(formData) {
        try {
            const { data } = await axios.post("/user/update-profile-pic", formData);
            updateImage(data.url);
            closeUploaderModal();
        } catch (err) {
            console.log("Err in Post /user-image: ", err);
        }
    }
    return (
        <div className= "uploader-overlay">
            <div className="close-uploader">
                <span onClick={closeUploaderModal}><img src="../images/close-button.png"></img></span>
            </div>
            <div className="image-form">
                <h3>Please select and Image to Upload</h3>
                <input onChange={readFile} type="file" name="file" id="file" className="inputfile" />
            </div>
        </div>
    );
}
