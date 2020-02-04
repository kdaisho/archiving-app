import React from "react";

const List = ({ langList, searchTerm }) => {
    let total = 0;
    return (
        <table className="table is-bordered is-striped">
            <thead>
                <tr className="has-background-warning">
                    <th>Index</th>
                    <th>Language</th>
                    <th>Framework</th>
                    <th>Logo</th>
                </tr>
            </thead>
            <tbody>
                {langList
                    // .filter(
                    //     lang =>
                    //         `${lang.name}`.toLowerCase().indexOf(searchTerm) >=
                    //         0
                    // )
                    // .map(lang =>
                    //     lang.frameworks.filter(fw =>
                    //         `${fw.name}`.toLowerCase().indexOf(searchTerm)
                    //     )
                    // )
                    .map(lang =>
                        lang.frameworks
                            .filter(
                                fw =>
                                    `${fw.name}`
                                        .toLowerCase()
                                        .indexOf(searchTerm) >= 0
                            )
                            .map(fw => {
                                total += 1;
                                return (
                                    <tr key={fw.id}>
                                        <td>{total}</td>
                                        <td>{lang.name}</td>
                                        <td>{fw.name}</td>
                                        <td>
                                            <img
                                                className="framework-logo"
                                                src={`./public/uploads/${fw.filename}`}
                                                alt={fw.filename}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                    )}
            </tbody>
        </table>
    );
};

export default List;
