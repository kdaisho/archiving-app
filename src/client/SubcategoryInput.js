import React from "react";

const SubcategoryInput = ({ handleChange, subcategory }) => (
    <div className="field">
        <label className="label">Subcategory</label>
        <div className="control">
            <input
                className="input"
                type="text"
                name="subcategory"
                placeholder="Subcategory name"
                onChange={handleChange}
                value={subcategory}
            />
        </div>
    </div>
);

export default SubcategoryInput;
