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
                            `${framework.firstName} ${framework.lastName}`
                                .toLowerCase()
                                .indexOf(searchTerm) >= 0
                    )
                    .map(framework => (
                        <li key={framework.id}>
                            {framework.firstName} {framework.lastName}
                        </li>
                    ))}
            </ul>
        );
    }
}

export default List;
