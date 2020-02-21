import React from "react";

const LanguageInput = ({ handleChange, langName, inputDisabled }) => (
    <div className="field">
        <label className="label">Language</label>
        <div className="control">
            <input
                id="langInput"
                className="input"
                type="text"
                name="langName"
                placeholder="Language Name"
                onChange={handleChange}
                value={langName}
                disabled={inputDisabled}
            />
        </div>
    </div>
);

export default LanguageInput;
