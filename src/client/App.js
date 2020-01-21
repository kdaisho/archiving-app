import React, { Component } from "react";
import List from "./List";
import LanguageDropdown from "./LanguageDropdown";

class App extends Component {
    state = {
        langList: [],
        frameworkList: [],
        framework: "",
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
        this.setState({ framework: "" });
    };

    handleSubmit = event => {
        event.preventDefault();
        const data = {
            framework: this.state.framework
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

                    <div className="field">
                        <label className="label">Framework</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                name="framework"
                                placeholder="Framework Name"
                                onChange={this.handleChange}
                                value={this.state.framework}
                            />
                        </div>
                    </div>
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
