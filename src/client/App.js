import React, { Component } from "react";

class App extends Component {
    state = {
        username: "",
        greeting: "",
        archiveList: [],
        searchTerm: ""
    };

    componentDidMount() {
        fetch("/api/getUsername")
            .then(res => res.json())
            .then(user => this.setState({ username: user.username }));
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
        console.log("event", event.target.value);
        this.setState({ searchTerm: event.target.value.toLowerCase() });
    };

    render() {
        const { username, greeting, archiveList, searchTerm } = this.state;
        return (
            <div>
                {username ? (
                    <h1>{`Hello ${username}`}</h1>
                ) : (
                    <h1>Loading...</h1>
                )}
                <div>
                    <h1>{greeting}</h1>
                    <ul>
                        {archiveList
                            .filter(
                                item =>
                                    `${item.name}`
                                        .toLowerCase()
                                        .indexOf(searchTerm) >= 0
                            )
                            .map(item => (
                                <li key={item.id}>{item.name}</li>
                            ))}
                    </ul>
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
            </div>
        );
    }
}

export default App;
