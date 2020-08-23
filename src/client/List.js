import React from "react";
import Spinner from "./Spinner";

const List = (props) => {
	const {
		currentApp,
		categoryList,
		searchTerm,
		sortAl,
		loading,
		deleteOne,
		editOne,
		toggleModal,
		newFileName
	} = props;

	let total = 0;
	const currentPort = window.location.href.replace(/https?:\/\/localhost:(\d{4})\//, "$1");
	const filePathDev = `./dist/images/uploads/${currentApp.appId}/`;
	const filePathProd = `./images/uploads/${currentApp.appId}/`;
	const currentPath = currentPort === "3000" ? filePathDev : filePathProd;

	return (
		<div>
			<table className="table is-bordered is-striped">
				<thead>
					<tr className="has-background-link">
						<th className="has-text-white">Index</th>
						<th className="has-text-white">{currentApp.category}</th>
						<th className="has-text-white">{currentApp.subcategory}</th>
						<th className="has-text-white thumbnail">Image</th>
						<th className="has-text-white status">Status</th>
						<th className="has-text-white action">Action</th>
					</tr>
				</thead>
				<tbody>
					{categoryList
						.sort((a, b) => {
							return sortAl ? a.name.localeCompare(b.name) : a.id - b.id;
						})
						.map((category) =>
							category.subcategories
								.filter((subcat) => `${subcat.name}`.toLowerCase().indexOf(searchTerm) >= 0)
								.map((subcat) => {
									total += 1;
									return (
										<tr key={subcat.id}>
											<td>{total}</td>
											<td>{category.name}</td>
											<td>{subcat.name}</td>
											<td className="thumbnail">
												{loading && subcat.filename === newFileName ? (
													<Spinner />
												) : (
													<img
														className="subcategory-img"
														onClick={() =>
															toggleModal(`${currentPath}${subcat.filename}`, subcat.name)
														}
														src={`${currentPath}${subcat.filename}`}
														alt={subcat.name}
													/>
												)}
											</td>
											<td className="status">
												{subcat.status ? (
													<span className="icon has-text-link">
														<i className="fas fa-check"></i>
													</span>
												) : null}
											</td>
											<td className="action">
												<span className="action-button-container">
													<button
														className="button is-warning"
														onClick={() => editOne(currentApp.appId, subcat.id)}
													>
														Edit
													</button>
													<button
														className="button is-danger"
														onClick={() =>
															deleteOne(
																currentApp.appId,
																category.name,
																subcat.id,
																subcat.name,
																subcat.filename
															)
														}
													>
														Delete
													</button>
												</span>
											</td>
										</tr>
									);
								})
						)}
				</tbody>
			</table>
		</div>
	);
};

export default List;
