import React, { Component } from "react";
import List from "./List";

class App extends Component {
    state = {
        archiveList: [],
        searchTerm: ""
    };

    componentDidMount() {
        fetch("/api/getList")
            .then(res => res.json())
            .then(archiveList => this.setState({ archiveList }));
    }

    sayHi = () => {
        fetch("/action/sayHi")
            .then(res => res.text())
            .then(greeting => this.setState({ greeting }));
    };

    write = () => {
        const input = document.getElementById("myInput");
        const name = input.value;
        if (!name) return false;
        fetch(`/action/write/${name}`)
            .then(res => res.json())
            .then(myObj => {
                this.setState({ archiveList: myObj.archives });
                input.value = "";
            });
    };

    handleSearch = event => {
        this.setState({ searchTerm: event.target.value.toLowerCase() });
    };

    render() {
        const { archiveList, searchTerm } = this.state;
        return (
            <div className="section">
                <h1 className="title">Archive Everything</h1>
                {archiveList ? (
                    <List archiveList={archiveList} searchTerm={searchTerm} />
                ) : (
                    <h2>Loading...</h2>
                )}
                <button onClick={this.sayHi}>Say Hi</button>
                <br />
                <br />
                <input
                    id="myInput"
                    type="text"
                    name="name"
                    placeholder="Your name here..."
                />
                <br />
                <br />
                <button onClick={() => this.write()}>Write</button>
                <br />
                <br />
                <input
                    type="text"
                    onChange={this.handleSearch}
                    placeholder="Search"
                />
            </div>
        );
    }
}

export default App;
