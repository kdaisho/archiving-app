import React from "react";

const CategoryDropdown = ({ currentApp, category, handleChange, categoryList, inputDisabled }) => {
	return (
		<div className="field">
			<label className="label">{currentApp.category} List</label>
			<div className="select">
				<select value={category} name="category" onChange={handleChange} disabled={inputDisabled}>
					<option value="">-- Select --</option>
					{categoryList.map((cat) => (
						<option key={cat.id} value={cat.name}>
							{cat.name}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default CategoryDropdown;
