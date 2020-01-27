import React from "react";

const LanguageInput = ({ handleChange, langName }) => (
    <div className="field">
        <label className="label">Language</label>
        <div className="control">
            <input
                className="input"
                type="text"
                name="langName"
                placeholder="Language Name"
                onChange={handleChange}
                value={langName}
            />
        </div>
    </div>
);

export default LanguageInput;
