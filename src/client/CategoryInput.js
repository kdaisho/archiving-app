import React from "react";
import { connect } from "react-redux";

const CategoryInput = ({ currentApp, handleChange, category, inputDisabled }) => (
	<div className="field">
		<label className="label">{currentApp.category}</label>
		<div className="control">
			<input
				id="categoryInput"
				className="input"
				type="text"
				name="category"
				placeholder={currentApp.category}
				onChange={handleChange}
				value={category}
				disabled={inputDisabled}
			/>
		</div>
	</div>
);

const mapStateToProps = ({ currentApp }) => ({ currentApp });

export default connect(mapStateToProps)(CategoryInput);
