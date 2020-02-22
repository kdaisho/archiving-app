import React from "react";

const Status = ({ handleCheckbox, status }) => {
    return (
        <div className="field is-checkbox">
            <label className="label">
                Status
                <div className="control">
                    <input
                        className="checkbox"
                        type="checkbox"
                        name="status"
                        checked={status}
                        onChange={handleCheckbox}
                    />
                </div>
            </label>
        </div>
    );
};

export default Status;
