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
        <div>
            <div id="uploader-close-container">
                <span onClick={closeUploaderModal} id="uploader-close-button">X</span>
            </div>
            <input onChange={readFile} type="file" name="file" id="file" className="inputfile" />
            <label id="select-image" htmlFor="file">select image</label>
        </div>
    );
}
