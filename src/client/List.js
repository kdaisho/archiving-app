import React, { Component } from "react";

class List extends Component {
    state = {
        frameworkList: []
    };

    render() {
        const { frameworkList, searchTerm } = this.props;
        return (
            <ul>
                {frameworkList
                    .filter(
                        framework =>
                            `${framework.name}`
                                .toLowerCase()
                                .indexOf(searchTerm) >= 0
                    )
                    .map(framework => (
                        <li key={framework.id}>{framework.name}</li>
                    ))}
            </ul>
        );
    }
}

export default List;
