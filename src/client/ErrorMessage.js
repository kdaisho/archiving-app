import React from "react";

const ErrorMessage = ({ errorMessage }) => (
    <div className="m-b-15">
        {errorMessage ? (
            <p className="has-text-danger">{errorMessage}</p>
        ) : (
            <p>&nbsp;</p>
        )}
    </div>
);

export default ErrorMessage;
