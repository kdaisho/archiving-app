import React, { Component } from "react";

class LanguageInput extends Component {
    render() {
        return (
            <div className="field">
                <label className="label">Language</label>
                <div className="control">
                    <input
                        className="input"
                        type="text"
                        name="langName"
                        placeholder="Language Name"
                        onChange={this.props.handleChange}
                        value={this.props.langName}
                    />
                </div>
            </div>
        );
    }
}

export default LanguageInput;
