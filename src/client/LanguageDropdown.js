import React from "react";

const LanguageDropdown = props => (
    <div className="m-b-15">
        <label className="label m-t-15">Language</label>
        <div className="select">
            <select>
                <option value="">-- Select Language --</option>
                {props.langList.map(lang => (
                    <option
                        key={lang.id}
                        value={lang.name.replace(/\s/g, "").toLowerCase()}
                    >
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

export default LanguageDropdown;
