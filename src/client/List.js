import React, { Component } from "react";

class List extends Component {
    state = {
        memberList: []
    };

    render() {
        const { memberList, searchTerm } = this.props;
        return (
            <ul>
                {memberList
                    .filter(
                        member =>
                            `${member.firstName} ${member.lastName}`
                                .toLowerCase()
                                .indexOf(searchTerm) >= 0
                    )
                    .map(member => (
                        <li key={member.id}>
                            {member.firstName} {member.lastName}
                        </li>
                    ))}
            </ul>
        );
    }
}

export default List;
