import React from "react";
import axios from "./axios";

export default function({ id, finishedUploading }) {
    function readFile(e) {
        const file = e.target.files[0];

        var formData = new FormData();
        formData.append("id", this.id);
        formData.append("file", this.file);

        submit(formData);
    }

    function submit(formData) {
        axios.post("/user-image", formData)
            .then( ({data}) => {
                console.log("response from POST /user-image:", data);
            })
            .catch(error => console.log("error in POST /user-image"));
    }

    return (
        <>
            <div id="modal">

                <div id="uploader-container">

                    <input onChange={readFile} type="file" name="file" id="file" class="inputfile" />
                    <label id="select-image" for="file">select image</label>
                    
                </div>

            </div>
        </>
    );
}
