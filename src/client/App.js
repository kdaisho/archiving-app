import React, { Component } from "react";
import List from "./List";
import LanguageDropdown from "./LanguageDropdown";
import FrameworkInput from "./FrameworkInput";
import LanguageInput from "./LanguageInput";

class App extends Component {
    state = {
        langList: [],
        langName: "",
        frameworkList: [],
        frameworkName: "",
        searchTerm: ""
    };

    componentDidMount() {
        fetch("/api/getList")
            .then(res => res.json())
            .then(data => {
                this.setState({
                    langList: data
                });
            });
    }

    handleSearch = event => {
        this.setState({ searchTerm: event.target.value.toLowerCase() });
    };

    handleChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    clearField = () => {
        this.setState({ langName: "", frameworkName: "" });
    };

    handleSubmit = event => {
        event.preventDefault();
        const data = {
            langName: this.state.langName.trim(),
            frameworkName: this.state.frameworkName.trim()
        };

        fetch("/api/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ langList: data });
                this.clearField();
            })
            .catch(error => {
                throw error;
            });
    };

    render() {
        const { langList, langName, frameworkName, searchTerm } = this.state;
        return (
            <div className="section">
                <h1 className="title">Programings</h1>

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

                    <button className="button">Save</button>
                </form>

                <div className="field">
                    <label className="label">Search Frameworks</label>
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
                    <List langList={langList} searchTerm={searchTerm} />
                ) : (
                    <h2>Loading...</h2>
                )}
            </div>
        );
    }
}

export default App;
