import React, { Component } from "react";
import List from "./List";

class App extends Component {
    state = {
        memberList: [],
        firstName: "",
        lastName: "",
        searchTerm: ""
    };

    componentDidMount() {
        fetch("/api/getList")
            .then(res => res.json())
            .then(memberList => this.setState({ memberList }));
    }

    handleSearch = event => {
        this.setState({ searchTerm: event.target.value.toLowerCase() });
    };

    handleChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    clearField = () => {
        this.setState({ firstName: "", lastName: "" });
    };

    handleSubmit = event => {
        event.preventDefault();
        const data = {
            firstName: this.state.firstName,
            lastName: this.state.lastName
        };

        fetch("/api/addMember", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(myobj => {
                this.setState({ memberList: myobj.members });
                this.clearField();
            })
            .catch(error => {
                throw error;
            });
    };

    render() {
        const { memberList, searchTerm } = this.state;
        return (
            <div className="section">
                <h1 className="title">Team AA Members</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="field">
                        <label className="label">First Name</label>
                        <div className="control">
                            <input
                                id="myInput"
                                className="input"
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                onChange={this.handleChange}
                                value={this.state.firstName}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Last Name</label>
                        <div className="control">
                            <input
                                id="myInput2"
                                className="input"
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                onChange={this.handleChange}
                                value={this.state.lastName}
                            />
                        </div>
                    </div>
                    <button className="button is-success">Submit</button>
                </form>

                <div className="field">
                    <label className="label">Search Members</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            onChange={this.handleSearch}
                            placeholder="Search"
                        />
                    </div>
                </div>

                {memberList ? (
                    <List memberList={memberList} searchTerm={searchTerm} />
                ) : (
                    <h2>Loading...</h2>
                )}
            </div>
        );
    }
}

export default App;
