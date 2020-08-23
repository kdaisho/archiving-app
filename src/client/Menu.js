import React, { useState } from "react";
import CategoryDropdown from "./CategoryDropdown";
import CategoryInput from "./CategoryInput";
import SubcategoryInput from "./SubcategoryInput";
import ErrorMessage from "./ErrorMessage";
import FileUpload from "./FileUpload";
import Status from "./Status";

const Menu = ({ navOpen, errorMessage, editing }) => {
	// console.log(props);
	const [currentApp, setCurrentApp] = useState({});
	const [category, setCategory] = useState("");
	const [categoryList, setCategoryList] = useState([]);
	const [inputDisabled, setInputDisabled] = useState(false);

	const handleChange = async (event) => {
		const { name, value, files } = event.target;
		this.setState({ [name]: files ? await files[0] : value });
	};

	const handleCheckbox = (event) => {
		this.setState({ status: event.target.checked });
	};

	const clearField = (event) => {
		event.preventDefault();
		this.setState({
			category: "",
			subcategory: "",
			file: {
				name: ""
			},
			status: false,
			editing: false,
			inputDisabled: false,
			editTargetId: ""
		});
	};

	const toggleNav = () => {
		this.setState({ navOpen: !this.state.navOpen });
	};

	const getErrorMessage = (...names) => {
		names = this.state.editing && names[2] ? names.slice(0, 2) : names;
		this.setState({ errorMessage: "" });
		if (names.filter((name) => !name).length) {
			this.setState({
				errorMessage: "Category name, subcategory name and image are required."
			});
			return true;
		}
	};

	const handleSubmit = (appId, event) => {
		event.preventDefault();
		const ts = Date.now();
		const fileName =
			this.state.file && this.state.file.name ? `${ts}-${this.state.file.name}` : null;
		const data = {
			appId,
			id: ts,
			category: this.state.category.trim(),
			subcategory: this.state.subcategory.trim(),
			fileName,
			editing: true,
			status: this.state.status
		};
		if (!getErrorMessage(this.state.category, this.state.subcategory, fileName)) {
			fetch("/api/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
			})
				.then((res) => res.json())
				.then((data) => {
					if (
						JSON.stringify(this.state.categoryList) !== JSON.stringify(data) &&
						this.state.file &&
						this.state.file.name
					) {
						this.handleSubmitFile(this.state.currentApp.appId, fileName);
						this.setState({ editing: false });
					}
					this.getList(appId);
					this.setState({ categoryList: data, navOpen: false });
					this.clearField(event);
				})
				.catch((error) => {
					throw error;
				});
		}
	};

	const handleSubmitFile = (appId, n) => {
		const formData = new FormData();
		formData.append("file", this.state.file);
		formData.append("fileName", n);
		formData.append("appId", appId);
		this.setState({ loading: true, newFileName: n });
		fetch("/api/upload", {
			method: "POST",
			body: formData
		})
			.then((res) => res.json())
			.then((data) => {
				this.setState({ resetting: true }, () => {
					this.setState({ resetting: false });
				});
				if (data) {
					this.setState({ loading: false, newFileName: "" });
				}
			})
			.catch((error) => console.error(error.message));
	};

	const saveEdit = (appId, event) => {
		event.preventDefault();
		const ts = Date.now();
		const tsName = this.state.file && this.state.file.name ? `${ts}-${this.state.file.name}` : null;

		const data = {
			appId,
			category: this.state.category.trim(),
			subcategory: this.state.subcategory.trim(),
			status: this.state.status,
			ts
		};

		if (tsName) {
			data.fileName = tsName;
			handleSubmitFile(appId, tsName);
		}

		this.setState({ inputDisabled: false, navOpen: false });
		this.clearField(event);

		fetch(`/api/edit/${this.state.editTargetId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
			.then((res) => res.json())
			.then((data) => {
				this.setState({ editTargetId: "" });
				this.getList(appId);
			})
			.catch((error) => console.error(error.message));
	};

	return (
		<nav className={`section ${navOpen && !showNoAppMsg ? "active" : ""}`}>
			<span className="knob has-text-link" onClick={toggleNav}>
				<i className="fas fa-paper-plane"></i>
			</span>
			<form>
				{/* <CategoryDropdown handleChange={handleChange} {...this.state} />
				<CategoryInput handleChange={handleChange} {...this.state} />
				<SubcategoryInput handleChange={handleChange} {...this.state} />
				<Status status={status} handleCheckbox={handleCheckbox} />
				<FileUpload handleChange={handleChange} {...this.state} /> */}
				<CategoryDropdown handleChange={handleChange} currentApp={currentApp} category={category} />
				<CategoryInput handleChange={handleChange} />
				<SubcategoryInput handleChange={handleChange} />
				<Status status={status} handleCheckbox={handleCheckbox} />
				<FileUpload handleChange={handleChange} />
				<ErrorMessage errorMessage={errorMessage} />
				{editing ? (
					<button
						className="button is-warning is-fullwidth"
						onClick={() => saveEdit(currentApp.appId, event)}
					>
						Save Edit
					</button>
				) : (
					<button
						className="button is-link is-fullwidth"
						onClick={() => handleSubmit(currentApp.appId, event)}
					>
						Save
					</button>
				)}
				<button className="button m-t-15 is-danger is-fullwidth" onClick={() => clearField(event)}>
					Clear
				</button>
			</form>
		</nav>
	);
};

export default Menu;
