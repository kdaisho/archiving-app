import React, { Component } from "react";

class List extends Component {
    state = {
        archiveList: []
    };

    render() {
        const { archiveList, searchTerm } = this.props;
        return (
            <ul>
                {archiveList
                    .filter(
                        item =>
                            `${item.name}`.toLowerCase().indexOf(searchTerm) >=
                            0
                    )
                    .map(item => (
                        <li key={item.id}>{item.name}</li>
                    ))}
            </ul>
        );
    }
}

export default List;
