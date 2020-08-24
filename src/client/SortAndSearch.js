import React from "react";
import { connect } from "react-redux";

const SortAndSearch = ({ applySort, sortAl, currentApp, handleSearch }) => (
	<React.Fragment>
		<div className="field">
			<label className="checkbox">
				<input type="checkbox" onChange={applySort} value={sortAl} /> Alphabetical Order
			</label>
		</div>
		<div className="field">
			<label className="label">Search {currentApp.subcategory}</label>
			<div className="control">
				<input className="input" type="text" onChange={handleSearch} placeholder="Search" />
			</div>
		</div>
	</React.Fragment>
);

const mapStateToProps = ({ currentApp }) => ({ currentApp });

export default connect(mapStateToProps)(SortAndSearch);
