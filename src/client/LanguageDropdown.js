import React, { Component } from "react";

class LanguageDropdown extends Component {
    render() {
        return (
            <div className="m-b-15">
                <label className="label m-t-15">Language</label>
                <div className="select">
                    <select
                        value={this.props.langName}
                        name="langName"
                        onChange={this.props.handleChange}
                    >
                        <option value="">-- Select Language --</option>
                        {this.props.langList.map(lang => (
                            <option key={lang.id} value={lang.name}>
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
