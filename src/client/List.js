import React from "react";

const List = ({ langList, searchTerm }) => {
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
