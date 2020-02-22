import React from "react";

const CategoryInput = ({ handleChange, category, inputDisabled }) => (
    <div className="field">
        <label className="label">Language</label>
        <div className="control">
            <input
                id="categoryInput"
                className="input"
                type="text"
                name="category"
                placeholder="Language Name"
                onChange={handleChange}
                value={category}
                disabled={inputDisabled}
            />
        </div>
    </div>
);

export default CategoryInput;
