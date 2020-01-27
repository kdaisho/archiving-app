import React from "react";

const LanguageDropdown = ({ langName, handleChange, langList }) => {
    return (
        <div className="m-b-15">
            <label className="label m-t-15">Language</label>
            <div className="select">
                <select
                    value={langName}
                    name="langName"
                    onChange={handleChange}
                >
                    <option value="">-- Select Language --</option>
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
