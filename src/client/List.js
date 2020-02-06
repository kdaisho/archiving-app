import React from "react";

const List = ({ langList, searchTerm, sortAl }) => {
    let total = 0;
    const port = window.location.href.replace(
        /https?:\/\/localhost:(\d+)\//,
        "$1"
    );
    console.log("Extracted", port);
    return (
        <table className="table is-bordered is-striped">
            <thead>
                <tr className="has-background-warning">
                    <th>Index</th>
                    <th>Language</th>
                    <th>Framework</th>
                    <th>Logo</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {langList
                    .sort((a, b) => {
                        return sortAl
                            ? a.name.localeCompare(b.name)
                            : a.id - b.id;
                    })
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
                                                src={`${
                                                    port.startsWith("3000")
                                                        ? "./dist/images/uploads/"
                                                        : "./images/uploads/"
                                                }${fw.filename}`}
                                                alt={fw.name}
                                            />
                                        </td>
                                        <td>
                                            <span className="action-button-container">
                                                <button className="button is-warning">
                                                    Edit
                                                </button>
                                                <button className="button is-danger">
                                                    Delete
                                                </button>
                                            </span>
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
