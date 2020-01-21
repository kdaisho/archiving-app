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
                    langList: data["langs"],
                    frameworkList: data["frameworks"]
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
        this.setState({ name: "" });
    };

    handleSubmit = event => {
        event.preventDefault();
        const data = {
            langName: this.state.langName,
            frameworkName: this.state.frameworkName
        };

        fetch("/api/addFramework", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(myobj => {
                this.setState({ frameworkList: myobj.frameworks });
                this.clearField();
            })
            .catch(error => {
                throw error;
            });
    };

    render() {
        const { frameworkList, searchTerm } = this.state;
        return (
            <div className="section">
                <h1 className="title">Programings</h1>

                <form onSubmit={this.handleSubmit}>
                    <LanguageDropdown langList={this.state.langList} />
                    <LanguageInput
                        handleChange={this.handleChange}
                        langName={this.state.langName}
                    />
                    <FrameworkInput
                        handleChange={this.handleChange}
                        frameworkName={this.state.frameworkName}
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

                {frameworkList ? (
                    <List
                        frameworkList={frameworkList}
                        searchTerm={searchTerm}
                    />
                ) : (
                    <h2>Loading...</h2>
                )}
            </div>
        );
    }
}

export default App;
