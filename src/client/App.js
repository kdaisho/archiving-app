import React, { Component } from "react";
import List from "./List";
import LanguageDropdown from "./LanguageDropdown";
import FrameworkInput from "./FrameworkInput";
import LanguageInput from "./LanguageInput";
import ErrorMessage from "./ErrorMessage";
import FileUpload from "./FileUpload";
import Done from "./Done";
import "./App.css";

class App extends Component {
    state = {
        langList: [],
        langName: "",
        frameworkList: [],
        frameworkName: "",
        searchTerm: "",
        errorMessage: "",
        file: {},
        sortAl: false,
        loading: false,
        editing: false,
        resetting: false,
        done: false,
        inputDisabled: false,
        navOpen: false,
        keyPressed: {},
        editTargetId: ""
    };

    componentDidMount() {
        this.getList();
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
    }

    getList = () => {
        fetch("/api/getList")
            .then(res => res.json())
            .then(data => this.setState({ langList: data }));
    };

    handleSearch = event => {
        this.setState({ searchTerm: event.target.value.toLowerCase() });
    };

    handleChange = async event => {
        const { name, value, files } = event.target;
        this.setState({ [name]: files ? await files[0] : value });
    };

    handleCheckbox = event => {
        this.setState({ done: event.target.checked }, () =>
            console.log("CHECKED", this.state.done)
        );
    };

    clearField = event => {
        event.preventDefault();
        this.setState({
            langName: "",
            frameworkName: "",
            file: {
                name: ""
            },
            done: false,
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

    handleSubmit = event => {
        event.preventDefault();
        const ts = Date.now();
        const fileName = this.state.file.name
            ? `${ts}-${this.state.file.name}`
            : null;
        const data = {
            id: ts,
            langName: this.state.langName.trim(),
            frameworkName: this.state.frameworkName.trim(),
            fileName,
            editing: true,
            done: this.state.done
        };
        if (
            !this.getErrorMessage(
                this.state.langName,
                this.state.frameworkName,
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
                        JSON.stringify(this.state.langList) !==
                            JSON.stringify(data) &&
                        this.state.file.name
                    ) {
                        this.handleSubmitFile(fileName);
                        this.setState({ editing: false });
                    }
                    this.setState({ langList: data, navOpen: false });
                    this.clearField(event);
                })
                .catch(error => {
                    throw error;
                });
        }
    };

    handleSubmitFile = n => {
        const formData = new FormData();
        formData.append("file", this.state.file);
        formData.append("fileName", n);
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
                errorMessage: "Language, framework and image are required."
            });
            return true;
        }
    };

    deleteOne = (langName, fwName, image) => {
        const data = {
            langName,
            fwName,
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
                console.log("Successfully deleted:", data);
                this.getList();
            })
            .catch(error => console.error(error.message));
    };

    editOne = id => {
        fetch(`/api/edit/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log("Editing:", data);
                this.setState({
                    langName: data.name,
                    frameworkName: data.frameworks[0].name,
                    done: data.frameworks[0].done,
                    editing: true,
                    inputDisabled: true,
                    navOpen: true,
                    editTargetId: id
                });
            });
    };

    saveEdit = event => {
        event.preventDefault();
        const tsName = this.state.file.name
            ? `${Date.now()}-${this.state.file.name}`
            : null;

        const data = {
            langName: this.state.langName.trim(),
            frameworkName: this.state.frameworkName.trim(),
            done: this.state.done
        };

        if (tsName) {
            data.fileName = tsName;
            this.handleSubmitFile(tsName);
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
                this.getList();
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
            document.getElementById("langInput").focus();
        }
    };

    handleKeyUp = () => {
        this.setState({ keyPressed: {} });
    };

    render() {
        const { langList, searchTerm, sortAl, loading } = this.state;
        return (
            <div className="section">
                <h1 className="title">Software Framework Archive</h1>
                <nav
                    className={`section ${this.state.navOpen ? "active" : ""}`}
                >
                    <span className="knob" onClick={this.toggleNav}></span>
                    <form>
                        <LanguageDropdown
                            handleChange={this.handleChange}
                            {...this.state}
                        />
                        <LanguageInput
                            handleChange={this.handleChange}
                            {...this.state}
                        />
                        <FrameworkInput
                            handleChange={this.handleChange}
                            frameworkName={this.state.frameworkName}
                        />
                        <Done
                            done={this.state.done}
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
                                    this.saveEdit(
                                        event,
                                        this.state.frameworkName
                                    )
                                }
                            >
                                Save Edit
                            </button>
                        ) : (
                            <button
                                className="button is-link is-fullwidth"
                                onClick={() => this.handleSubmit(event)}
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
                        <label className="label">Search Framework</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                onChange={this.handleSearch}
                                placeholder="Search"
                            />
                        </div>
                    </div>

                    {langList ? (
                        <List
                            loading={loading}
                            langList={langList}
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
