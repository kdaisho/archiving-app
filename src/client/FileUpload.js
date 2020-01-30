import React from "react";

const FileUpload = ({ handleChange, fileName }) => (
    <div className="file has-name m-b-30 is-dark">
        <label className="file-label">
            <input
                className="file-input"
                type="file"
                name="file"
                onChange={handleChange}
            />
            <span className="file-cta">
                <span className="file-icon">
                    <i className="fas fa-upload"></i>
                </span>
                <span className="file-label">Upload Image</span>
            </span>
            <span className="file-name">{fileName}</span>
        </label>
    </div>
);

export default FileUpload;
