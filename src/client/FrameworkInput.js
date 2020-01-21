import React, { Component } from "react";

class FrameworkInput extends Component {
    state = {};

    render() {
        return (
            <div className="field">
                <label className="label">Framework</label>
                <div className="control">
                    <input
                        className="input"
                        type="text"
                        name="name"
                        placeholder="Framework Name"
                        onChange={this.props.handleChange}
                        value={this.props.name}
                    />
                </div>
            </div>
        );
    }
}

export default FrameworkInput;
