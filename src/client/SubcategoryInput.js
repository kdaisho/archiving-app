import React from "react";

const SubcategoryInput = ({ handleChange, frameworkName }) => (
    <div className="field is-framework">
        <label className="label">Framework</label>
        <div className="control">
            <input
                className="input"
                type="text"
                name="frameworkName"
                placeholder="Framework Name"
                onChange={handleChange}
                value={frameworkName}
            />
        </div>
    </div>
);

export default SubcategoryInput;
