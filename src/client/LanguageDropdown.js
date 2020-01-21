import React, { Component } from "react";

class LanguageDropdown extends Component {
    state = {};

    render() {
        return (
            <div className="m-b-15">
                <label className="label m-t-15">Language</label>
                <div className="select">
                    <select>
                        <option value="">-- Select Language --</option>
                        {this.props.langList.map(lang => (
                            <option
                                key={lang.identifier}
                                value={lang.identifier}
                            >
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }
}

export default LanguageDropdown;
