import React from "react";

const CategoryInput = ({
    currentApp,
    handleChange,
    category,
    inputDisabled
}) => (
    <div className="field">
        <label className="label">{currentApp.category}</label>
        <div className="control">
            <input
                id="categoryInput"
                className="input"
                type="text"
                name="category"
                placeholder={currentApp.category}
                onChange={handleChange}
                value={category}
                disabled={inputDisabled}
            />
        </div>
    </div>
);

export default CategoryInput;
