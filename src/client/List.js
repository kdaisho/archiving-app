import React from "react";

const List = props => {
    const { langList, searchTerm } = props;
    return (
        <ul>
            {langList
                .filter(
                    lang =>
                        `${lang.name}`.toLowerCase().indexOf(searchTerm) >= 0
                )
                .map(lang => (
                    <li key={lang.id}>{lang.name}</li>
                ))}
        </ul>
    );
};

export default List;
