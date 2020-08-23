import React, { useEffect, useState } from "react";
import List from "./List";
import CategoryDropdown from "./CategoryDropdown";
import CategoryInput from "./CategoryInput";
import SubcategoryInput from "./SubcategoryInput";
import ErrorMessage from "./ErrorMessage";
import FileUpload from "./FileUpload";
import Status from "./Status";
import SortAndSearch from "./SortAndSearch";
import Spinner from "./Spinner";
import Modal from "./Modal.js";
import "./App.css";

// class App extends Component {
const App = () => {
	const [applications, setApplications] = useState({});
	const [currentApp, setCurrentApp] = useState({});
	// const [defaultApp, setDefaultApp] = useState("");
	const [categoryList, setCategoryList] = useState([]);
	const [category, setCategory] = useState("");
	const [subcategory, setSubcategory] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [file, setFile] = useState({});
	const [path, setPath] = useState("");
	const [sortAl, setSortAl] = useState(false);
	const [loading, setLoading] = useState(false);
	const [switching, setSwitching] = useState(false);
	const [editing, setEditing] = useState(false);
	const [resetting, setResetting] = useState(false);
	const [status, setStatus] = useState(false);
	const [inputDisabled, setInputDisabled] = useState(false);
	const [navOpen, setNavOpen] = useState(false);
	const [keyPressed, setKeyPressed] = useState({});
	const [editTargetId, setEditTargetId] = useState("");
	const [newFileName, setNewFileName] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [showNoAppMsg, setShowNoAppMsg] = useState(false);
	const [lastUpdated, setLastUpdated] = useState("");
	let defaultApp = "";

	useEffect(() => {
		getInitialApp();
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	// useEffect(() => {
	// 	// if (Object.keys(applications).length <= 0) return;
	// 	if (!defaultApp) return;
	// 	console.log("using default app", applications);
	// 	setCurrentApp(defaultApp);
	// 	setApplications(applications);
	// 	// !Object.keys(applications).length ? setShowNoAppMsg(true) : getList(currentApp.appId);
	// }, [defaultApp]);

	useEffect(() => {
		console.log("Len of currentApp", Object.keys(currentApp).length);
		if (Object.keys(currentApp).length <= 0) return;
		console.log("CALLING GET_LIST", currentApp);
		// !Object.keys(applications).length ? setShowNoAppMsg(true) : getList(currentApp.appId);
		if (!Object.keys(applications).length <= 0) {
			setShowNoAppMsg(true);
		} else {
			// getList(currentApp.appId);
			setShowNoAppMsg(false);
		}
	}, [currentApp]);

	useEffect(() => {
		if (Object.keys(applications).length <= 0) return;
		console.log("Getting list called", currentApp);
		getList(currentApp.appId);
	}, [applications]);

	const getInitialApp = () => {
		fetch(`/api/init`)
			.then((res) => res.json())
			.then((ap) => {
				// let defaultApp = {};
				console.log(ap);
				for (let key in ap) {
					defaultApp = ap[key];
					// setDefaultApp(ap[key]);
					// console.log("setting default app", ap[key]);
					break;
				}
				// !Object.keys(ap).length ? setShowNoAppMsg(true) : getList(currentApp.appId);
				setCurrentApp(defaultApp);
				setApplications(ap);
				// this.setState({ currentApp: defaultApp, applications }, () => {
				// 	!Object.keys(this.state.applications).length
				// 		? this.setState({ showNoAppMsg: true })
				// 		: this.getList(this.state.currentApp.appId);
				// });
				// !Object.keys(ap).length ? setShowNoAppMsg(true) : getList(currentApp.appId);
				// setCurrentApp(defaultApp);
				// setApplications(ap);
			})
			.catch((error) => {
				console.log("ERROR and currentApp", currentApp);
				throw error;
			});
	};

	useEffect(() => {
		if (categoryList.length <= 0) return;
	}, [categoryList]);

	const getList = (appId) => {
		console.log("Getting List", appId);
		if (!appId) return;
		fetch(`/api/getList/${appId}`)
			.then((res) => res.json())
			.then((data) => {
				console.log("DATA is HERE", data);
				// this.setState(
				// 	{
				// 		categoryList: data.list,
				// 		lastUpdated: data.ts
				// 			? new Date(data.ts).toLocaleDateString("default", {
				// 					month: "short",
				// 					weekday: "short",
				// 					year: "numeric",
				// 					day: "numeric",
				// 					hour: "numeric",
				// 					minute: "numeric"
				// 			  })
				// 			: null
				// 	},
				// 	() => this.setState({ switching: false })
				// );
				setCategoryList(data.list);
				setLastUpdated(
					data.ts
						? new Date(data.ts).toLocaleDateString("default", {
								month: "short",
								weekday: "short",
								year: "numeric",
								day: "numeric",
								hour: "numeric",
								minute: "numeric"
						  })
						: null
				);
			})
			.catch((error) => console.log("GET LIST FAILED", error));
	};

	const handleSearch = (event) => {
		// this.setState({ searchTerm: event.target.value.toLowerCase() });
		setSearchTerm(event.target.value.toLowerCase());
	};

	const handleChange = async (event) => {
		const { name, value, files } = event.target;
		// this.setState({ [name]: files ? await files[0] : value });
		console.log("NAME, VALUE, FILES", name, value, files);
	};

	const handleCheckbox = (event) => {
		// this.setState({ status: event.target.checked });
		setStatus(event.target.checked);
	};

	const clearField = (event) => {
		event.preventDefault();
		// this.setState({
		// 	category: "",
		// 	subcategory: "",
		// 	file: {
		// 		name: ""
		// 	},
		// 	status: false,
		// 	editing: false,
		// 	inputDisabled: false,
		// 	editTargetId: ""
		// });
		setCategory("");
		setSubcategory("");
		setFile({ name: "" });
		setStatus(false);
		setEditing(false);
		setInputDisabled(false);
		setEditTargetId("");
	};

	const applySort = () => {
		// this.setState(() => ({ sortAl: !this.state.sortAl }));
		setSortAl((sortAl) => !sortAl);
	};

	const toggleNav = () => {
		// this.setState({ navOpen: !this.state.navOpen });
		setNavOpen((navOpen) => !navOpen);
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
		if (!this.getErrorMessage(this.state.category, this.state.subcategory, fileName)) {
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

	const deleteOne = (appId, category, id, subcategory, image) => {
		const ts = Date.now();
		const data = {
			appId,
			category,
			subcategory,
			image,
			ts
		};

		fetch("/api/delete", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
			.then((res) => res.json)
			.then((data) => {
				this.getList(appId);
			})
			.catch((error) => console.error(error.message));
	};

	const editOne = (appId, id) => {
		fetch(`/api/edit/${appId}/${id}`)
			.then((res) => res.json())
			.then((data) => {
				this.setState({
					category: data.name,
					subcategory: data.subcategories[0].name,
					status: data.subcategories[0].status,
					editing: true,
					inputDisabled: true,
					navOpen: true,
					editTargetId: id
				});
			});
	};

	const saveEdit = (appId, event) => {
		event.preventDefault();
		const ts = Date.now();
		// const tsName = this.state.file && this.state.file.name ? `${ts}-${this.state.file.name}` : null;
		const tsName = file && file.name ? `${ts}-${file.name}` : null;

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

		// this.setState({ inputDisabled: false, navOpen: false });
		setInputDisabled(false);
		setNavOpen(false);
		clearField(event);

		fetch(`/api/edit/${this.state.editTargetId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
			.then((res) => res.json())
			.then((data) => {
				// this.setState({ editTargetId: "" });
				setEditTargetId("");
				getList(appId);
			})
			.catch((error) => console.error(error.message));
	};

	const handleKeyDown = (event) => {
		if (event.key === "Alt") {
			const alt = { [event.key]: event.key };
			// this.setState({ keyPressed: alt });
			setKeyPressed(alt);
		}
		// if (this.state.keyPressed["Alt"] && event.key === "Shift") {
		if (keyPressed["Alt"] && event.key === "Shift") {
			// this.setState({ navOpen: !this.state.navOpen });
			setNavOpen((navOpen) => !navOpen);
			document.getElementById("categoryInput").focus();
		}
		if (event.key === "Escape" && navOpen) {
			// this.setState({ navOpen: false });
			setNavOpen(false);
		}
		if (event.key === "Escape" && showModal) {
			// this.setState((prevState) => ({
			// 	showModal: !prevState.showModal
			// }));
			setShowModal((showModal) => !showModal);
		}
	};

	const handleKeyUp = () => {
		// this.setState({ keyPressed: {} });
		setKeyPressed({});
	};

	useEffect(() => {
		getList(currentApp["appId"]);
		setSwitching(false);
		setShowNoAppMsg(false);
	}, [switching]);

	const handleChangeApp = () => {
		// this.setState(
		// 	{
		// 		currentApp: this.state.applications[event.target.value],
		// 		switching: true
		// 	},
		// 	() => {
		// 		this.getList(this.state.currentApp["appId"]);
		// 	}
		// );
		console.log("CHANGING", applications);
		setCurrentApp(applications[event.target.value]);
		setSwitching(true);
	};

	const toggleModal = (src, filename) => {
		// this.setState({
		// 	path: src,
		// 	filename,
		// 	showModal: !this.state.showModal
		// });
		setPath(src);
		setFileName(filename);
		setShowModal((showModal) => !showModal);
	};

	// const {
	// 	applications,
	// 	currentApp,
	// 	categoryList,
	// 	navOpen,
	// 	status,
	// 	errorMessage,
	// 	editing,
	// 	switching,
	// 	lastUpdated,
	// 	showModal,
	// 	showNoAppMsg
	// } = this.state;

	return (
		<div className="section">
			<div className="title-group">
				<h1 className="title is-size-4">{currentApp.name}</h1>
				<p>
					{lastUpdated && (
						<span>
							Last Updated: <time>{lastUpdated}</time>
						</span>
					)}
				</p>
			</div>
			<div className="field">
				<div className="select">
					<select value="" name="currentApp" onChange={handleChangeApp}>
						<option value="">-- Select Application --</option>
						{Object.keys(applications).map((key) => (
							<option key={key} value={key}>
								{applications[key].name}
							</option>
						))}
					</select>
				</div>
			</div>
			<nav className={`section ${navOpen && !showNoAppMsg ? "active" : ""}`}>
				<span className="knob has-text-link" onClick={toggleNav}>
					<i className="fas fa-paper-plane"></i>
				</span>
				<form>
					<CategoryDropdown
						handleChange={handleChange}
						currentApp={currentApp}
						category={category}
						categoryList={categoryList}
						inputDisabled={inputDisabled}
					/>
					<CategoryInput
						handleChange={handleChange}
						currentApp={currentApp}
						category={category}
						inputDisabled={inputDisabled}
					/>
					<SubcategoryInput
						handleChange={handleChange}
						currentApp={currentApp}
						subcategory={subcategory}
					/>
					<Status status={status} handleCheckbox={handleCheckbox} />
					<FileUpload handleChange={handleChange} resetting={resetting} file={file} />
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
					<button
						className="button m-t-15 is-danger is-fullwidth"
						onClick={() => clearField(event)}
					>
						Clear
					</button>
				</form>
			</nav>

			<main className="is-search">
				<SortAndSearch
					applySort={applySort}
					handleSearch={handleSearch}
					sortAl={sortAl}
					currentApp={currentApp}
				/>
				{categoryList && !switching ? (
					<List
						toggleModal={toggleModal}
						editOne={editOne}
						deleteOne={deleteOne}
						currentApp={currentApp}
						categoryList={categoryList}
						searchTerm={searchTerm}
						sortAl={sortAl}
						loading={loading}
						newFileName={newFileName}
					/>
				) : (
					<Spinner />
				)}
			</main>
			<div
				className={`backdrop ${navOpen || showNoAppMsg ? "active" : ""}`}
				// onClick={() => this.setState({ navOpen: false })}
				onClick={() => setNavOpen(false)}
			></div>
			{showModal && (
				<Modal>
					<div className={`modal`}>
						<div className="modal-background" onClick={toggleModal}></div>
						<div className="modal-content">
							<img src={this.state.path} alt={this.state.filename} />
						</div>
						<button className="modal-close is-large" onClick={toggleModal}></button>
					</div>
				</Modal>
			)}
			{showNoAppMsg && (
				<div className="no-application-msg">
					<p>Hummm...</p>
					<p>It looks like you haven't set up the application yet.</p>
					<p>
						Go to application root directory, enter <code>node&nbsp;setup</code>
					</p>
					<p>Then follow the instructions to create initial file.</p>
				</div>
			)}
		</div>
	);
};

export default App;
