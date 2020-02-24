import React, { Component } from "react";
import List from "./List";
import CategoryDropdown from "./CategoryDropdown";
import CategoryInput from "./CategoryInput";
import SubcategoryInput from "./SubcategoryInput";
import ErrorMessage from "./ErrorMessage";
import FileUpload from "./FileUpload";
import Status from "./Status";
import app from "../../data/applications";
import "./App.css";

class App extends Component {
    state = {
        currentApp: {},
        categoryList: [],
        category: "",
        subcategory: "",
        searchTerm: "",
        errorMessage: "",
        file: {},
        sortAl: false,
        loading: false,
        editing: false,
        resetting: false,
        status: false,
        inputDisabled: false,
        navOpen: false,
        keyPressed: {},
        editTargetId: ""
    };

    componentDidMount() {
        let defaultApp = {};
        for (let key in app) {
            defaultApp = app[key];
            break;
        }
        this.setState({ currentApp: defaultApp }, () =>
            this.getList(this.state.currentApp.appId)
        );
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
    }

    getList = appId => {
        fetch(`/api/getList/${appId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ categoryList: data });
            });
    };

    handleSearch = event => {
        this.setState({ searchTerm: event.target.value.toLowerCase() });
    };

    handleChange = async event => {
        const { name, value, files } = event.target;
        this.setState({ [name]: files ? await files[0] : value });
    };

    handleCheckbox = event => {
        this.setState({ status: event.target.checked });
    };

    clearField = event => {
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

    applySort = () => {
        this.setState(() => ({ sortAl: !this.state.sortAl }));
    };

    toggleNav = () => {
        this.setState({ navOpen: !this.state.navOpen });
    };

    handleSubmit = (appId, event) => {
        event.preventDefault();
        const ts = Date.now();
        const fileName = this.state.file.name
            ? `${ts}-${this.state.file.name}`
            : null;
        const data = {
            appId,
            id: ts,
            category: this.state.category.trim(),
            subcategory: this.state.subcategory.trim(),
            fileName,
            editing: true,
            status: this.state.status
        };
        if (
            !this.getErrorMessage(
                this.state.category,
                this.state.subcategory,
                fileName
            )
        ) {
            fetch("/api/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    if (
                        JSON.stringify(this.state.categoryList) !==
                            JSON.stringify(data) &&
                        this.state.file.name
                    ) {
                        this.handleSubmitFile(
                            this.state.currentApp.appId,
                            fileName
                        );
                        this.setState({ editing: false });
                    }
                    this.setState({ categoryList: data, navOpen: false });
                    this.clearField(event);
                })
                .catch(error => {
                    throw error;
                });
        }
    };

    handleSubmitFile = (appId, n) => {
        const formData = new FormData();
        formData.append("file", this.state.file);
        formData.append("fileName", n);
        formData.append("appId", appId);
        this.setState({ loading: true });
        fetch("/api/upload", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ resetting: true }, () => {
                    this.setState({ resetting: false });
                });
                if (data) {
                    this.setState({ loading: false });
                }
            })
            .catch(error => console.error(error.message));
    };

    getErrorMessage = (...names) => {
        names = this.state.editing && names[2] ? names.slice(0, 2) : names;
        this.setState({ errorMessage: "" });
        if (names.filter(name => !name).length) {
            this.setState({
                errorMessage:
                    "Category name, subcategory name and image are required."
            });
            return true;
        }
    };

    deleteOne = (appId, category, subcategory, image) => {
        const data = {
            appId,
            category,
            subcategory,
            image
        };

        fetch("/api/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json)
            .then(data => {
                this.getList(appId);
            })
            .catch(error => console.error(error.message));
    };

    editOne = (appId, id) => {
        fetch(`/api/edit/${appId}/${id}`)
            .then(res => res.json())
            .then(data => {
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

    saveEdit = (appId, event) => {
        event.preventDefault();
        const tsName = this.state.file.name
            ? `${Date.now()}-${this.state.file.name}`
            : null;

        const data = {
            appId,
            category: this.state.category.trim(),
            subcategory: this.state.subcategory.trim(),
            status: this.state.status
        };

        if (tsName) {
            data.fileName = tsName;
            this.handleSubmitFile(appId, tsName);
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
            .then(res => res.json())
            .then(data => {
                this.setState({ editTargetId: "" });
                this.getList(appId);
            })
            .catch(error => console.error(error.message));
    };

    handleKeyDown = event => {
        if (event.key === "Alt") {
            const alt = { [event.key]: event.key };
            alt[event.key] = event.key;
            this.setState({ keyPressed: alt });
        }
        if (this.state.keyPressed["Alt"] && event.key === "Shift") {
            this.setState({ navOpen: !this.state.navOpen });
            document.getElementById("categoryInput").focus();
        }
    };

    handleKeyUp = () => {
        this.setState({ keyPressed: {} });
    };

    handleChangeApp = () => {
        this.setState({ currentApp: app[event.target.value] }, () => this.getList(this.state.currentApp["appId"]));
    };

    render() {
        const {
            currentApp,
            categoryList,
            searchTerm,
            sortAl,
            loading
        } = this.state;
        return (
            <div className="section">
                <h1 className="title">{currentApp.name}</h1>
                <div className="field">
                    <div className="select">
                        <select
                            value=""
                            name="currentApp"
                            onChange={this.handleChangeApp}
                        >
                            <option value="">-- Select Application --</option>
                            {
                                Object.keys(app).map(key => <option key={key} value={key}>{app[key].name}</option>)
                            }
                        </select>
                    </div>
                </div>
                <nav
                    className={`section ${this.state.navOpen ? "active" : ""}`}
                >
                    <span className="knob" onClick={this.toggleNav}></span>
                    <form>
                        <CategoryDropdown
                            handleChange={this.handleChange}
                            {...this.state}
                        />
                        <CategoryInput
                            handleChange={this.handleChange}
                            {...this.state}
                        />
                        <SubcategoryInput
                            handleChange={this.handleChange}
                            {...this.state}
                        />
                        <Status
                            status={this.state.status}
                            handleCheckbox={this.handleCheckbox}
                        />
                        <FileUpload
                            handleChange={this.handleChange}
                            {...this.state}
                        />
                        <ErrorMessage errorMessage={this.state.errorMessage} />
                        {this.state.editing ? (
                            <button
                                className="button is-warning is-fullwidth"
                                onClick={() =>
                                    this.saveEdit(currentApp.appId, event)
                                }
                            >
                                Save Edit
                            </button>
                        ) : (
                            <button
                                className="button is-link is-fullwidth"
                                onClick={() =>
                                    this.handleSubmit(currentApp.appId, event)
                                }
                            >
                                Save
                            </button>
                        )}
                        <button
                            className="button m-t-15 is-danger is-fullwidth"
                            onClick={() => this.clearField(event)}
                        >
                            Clear
                        </button>
                    </form>
                </nav>

                <main className="is-search">
                    <div className="field">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                onChange={this.applySort}
                                value={this.state.sortAl}
                            />{" "}
                            Alphabetical Order
                        </label>
                    </div>
                    <div className="field">
                        <label className="label">
                            Search {currentApp.subcategory}
                        </label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                onChange={this.handleSearch}
                                placeholder="Search"
                            />
                        </div>
                    </div>

                    {categoryList ? (
                        <List
                            currentApp={currentApp}
                            loading={loading}
                            categoryList={categoryList}
                            searchTerm={searchTerm}
                            sortAl={sortAl}
                            deleteOne={this.deleteOne}
                            editOne={this.editOne}
                        />
                    ) : (
                        <h2>Loading...</h2>
                    )}
                </main>
                <div
                    className={`backdrop ${this.state.navOpen ? "active" : ""}`}
                    onClick={() => this.setState({ navOpen: false })}
                ></div>
            </div>
        );
    }
}

export default App;
