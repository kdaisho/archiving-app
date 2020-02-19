import React from "react";

const Done = ({ handleCheckbox, done }) => {
    return (
        <div className="field is-checkbox">
            <label className="label">
                Done
                <div className="control">
                    <input
                        className="checkbox"
                        type="checkbox"
                        name="done"
                        checked={done}
                        onChange={handleCheckbox}
                    />
                </div>
            </label>
        </div>
    );
};

export default Done;
