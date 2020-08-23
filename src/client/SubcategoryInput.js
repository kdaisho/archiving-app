import React from "react";

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

export default SubcategoryInput;
