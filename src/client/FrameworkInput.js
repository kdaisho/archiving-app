import React from "react";

const FrameworkInput = props => (
    <div className="field">
        <label className="label">Framework</label>
        <div className="control">
            <input
                className="input"
                type="text"
                name="frameworkName"
                placeholder="Framework Name"
                onChange={props.handleChange}
                value={props.frameworkName}
            />
        </div>
    </div>
);

export default FrameworkInput;
