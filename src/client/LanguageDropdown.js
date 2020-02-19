import React from "react";

const LanguageDropdown = ({
    langName,
    handleChange,
    langList,
    inputDisabled
}) => {
    return (
        <div className="field">
            <label className="label">Lang List</label>
            <div className="select">
                <select
                    value={langName}
                    name="langName"
                    onChange={handleChange}
                    disabled={inputDisabled}
                >
                    <option value="">-- Select --</option>
                    {langList.map(lang => (
                        <option key={lang.id} value={lang.name}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default LanguageDropdown;
