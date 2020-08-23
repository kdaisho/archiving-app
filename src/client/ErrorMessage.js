import React from "react";

const ErrorMessage = ({ errorMessage }) => (
	<div className="error-msg m-b-15">
		{errorMessage ? <p className="has-text-danger">{errorMessage}</p> : null}
	</div>
);

export default ErrorMessage;
