import React from "react";

const CategoryDropdown = ({
    category,
    handleChange,
    categoryList,
    inputDisabled
}) => {
    return (
        <div className="field">
            <label className="label">Lang List</label>
            <div className="select">
                <select
                    value={category}
                    name="category"
                    onChange={handleChange}
                    disabled={inputDisabled}
                >
                    <option value="">-- Select --</option>
                    {categoryList.map(lang => (
                        <option key={lang.id} value={lang.name}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default CategoryDropdown;
