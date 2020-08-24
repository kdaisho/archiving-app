import React from "react";
import { connect } from "react-redux";

const SubcategoryInput = ({ currentApp, handleChange, subcategory }) => (
	<div className="field">
		<label className="label">{currentApp.subcategory}</label>
		<div className="control">
			<input
				className="input"
				type="text"
				name="subcategory"
				placeholder={currentApp.subcategory}
				onChange={handleChange}
				value={subcategory}
			/>
		</div>
	</div>
);

const mapStateToProps = ({ currentApp }) => ({ currentApp });

export default connect(mapStateToProps)(SubcategoryInput);
