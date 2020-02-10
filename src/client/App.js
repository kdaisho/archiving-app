import React, { Component } from "react";
import List from "./List";
import LanguageDropdown from "./LanguageDropdown";
import FrameworkInput from "./FrameworkInput";
import LanguageInput from "./LanguageInput";
import ErrorMessage from "./ErrorMessage";
import FileUpload from "./FileUpload";
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
        loading: false
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
        this.setState({ [name]: files ? await files[0] : value });
    };

    clearField = () => {
        this.setState({ langName: "", frameworkName: "" });
    };

    handleSubmit = event => {
        event.preventDefault();
        const ts = Date.now();
        this.setState({ loading: true });
        const fileName = this.state.file.name
            ? `${ts}-${this.state.file.name}`
            : null;
        const data = {
            id: ts,
            langName: this.state.langName.trim(),
            frameworkName: this.state.frameworkName.trim(),
            fileName
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
                        !(
                            JSON.stringify(this.state.langList) ===
                            JSON.stringify(data)
                        )
                    ) {
                        this.setState({ langList: data });
                        this.state.file.name && this.handleSubmitFile(fileName);
                    }
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

        fetch("/api/upload", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setTimeout(() => {
                    this.setState({ loading: false });
                }, 1000);
            })
            .catch(error => console.error(error.message));
    };

    getErrorMessage = (...names) => {
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

    deleteOne = (langName, fwName) => {
        const data = {
            langName,
            fwName
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

    render() {
        const {
            langList,
            langName,
            frameworkName,
            searchTerm,
            sortAl,
            loading
        } = this.state;

        return (
            <div>
                <div className="section">
                    <h1 className="title">Software Framework Archive</h1>
                    <form onSubmit={this.handleSubmit}>
                        <LanguageDropdown
                            langList={langList}
                            langName={this.state.langName}
                            handleChange={this.handleChange}
                        />
                        <LanguageInput
                            handleChange={this.handleChange}
                            langName={langName}
                        />
                        <FrameworkInput
                            handleChange={this.handleChange}
                            frameworkName={frameworkName}
                        />
                        <ErrorMessage errorMessage={this.state.errorMessage} />
                        <FileUpload
                            handleChange={this.handleChange}
                            fileName={this.state.file.name}
                        />

                        <button
                            className="button is-info is-fullwidth"
                            onClick={event => {
                                this.getErrorMessage(
                                    this.state.langName,
                                    this.state.frameworkName,
                                    this.state.file.name
                                ) && event.preventDefault();
                            }}
                        >
                            Save
                        </button>
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
