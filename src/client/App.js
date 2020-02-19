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
        inputDisabled: false
    };

    temp = {
        langName: "",
        frameworkName: "",
        done: false,
        fwId: ""
    };

    componentDidMount() {
        this.getList();
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
        this.setState({ [name]: files ? await files[0] : value }, () =>
            console.log("handleChange", this.state)
        );
    };

    handleCheckbox = event => {
        this.setState({ done: event.target.checked }, () =>
            console.log("CHECKED", this.state.done)
        );
    };

    clearField = () => {
        this.setState({
            langName: "",
            frameworkName: "",
            file: {
                name: ""
            },
            done: false
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        const fileName = this.state.file.name
            ? `${Date.now()}-${this.state.file.name}`
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
                    this.setState({ langList: data });
                    setTimeout(() => this.setState({ loading: false }), 1750);
                    this.clearField();
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
                setTimeout(() => {
                    this.setState({ loading: false });
                }, 1750);
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

    applySort = () => {
        this.setState(() => ({ sortAl: !this.state.sortAl }));
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
        this.temp.fwId = id;
        fetch(`/api/edit/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log("Editing:", data);
                this.setState({
                    langName: data.name,
                    frameworkName: data.frameworks[0].name,
                    done: data.frameworks[0].done,
                    editing: true,
                    inputDisabled: true
                });
            });
    };

    saveEdit = event => {
        event.preventDefault();
        const id = this.temp.fwId;
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

        fetch(`/api/edit/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log("Saving:", data);
                this.setState({ inputDisabled: false });
                this.clearField();
                this.getList();
            })
            .catch(error => console.error(error.message));
    };

    render() {
        const { langList, searchTerm, sortAl, loading } = this.state;
        return (
            <div>
                <div className="section">
                    <h1 className="title">Software Framework Archive</h1>
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
                        <ErrorMessage errorMessage={this.state.errorMessage} />
                        <FileUpload
                            handleChange={this.handleChange}
                            {...this.state}
                        />

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
                    </form>
                </div>

                <div className="section is-search">
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
                </div>
            </div>
        );
    }
}

export default App;
