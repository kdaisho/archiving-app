import React from "react";

const List = ({ langList, searchTerm }) => {
    return (
        <ul>
            {langList
                .filter(
                    lang =>
                        `${lang.name}`.toLowerCase().indexOf(searchTerm) >= 0
                )
                .map(lang =>
                    lang.frameworks.map(fw => (
                        <li key={fw.id}>
                            {lang.name} - {fw.name} -
                            <img
                                className="framework-logo"
                                src={`./public/uploads/${fw.filename}`}
                                alt={fw.filename}
                            />
                        </li>
                    ))
                )}
        </ul>
    );
};

export default List;
