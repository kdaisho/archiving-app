import React from "react";

const LanguageInput = props => (
    <div className="field">
        <label className="label">Language</label>
        <div className="control">
            <input
                className="input"
                type="text"
                name="langName"
                placeholder="Language Name"
                onChange={props.handleChange}
                value={props.langName}
            />
        </div>
    </div>
);

export default LanguageInput;
