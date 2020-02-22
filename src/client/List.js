import React, { Component } from "react";

class List extends Component {
    state = {
        imageName: "",
        showModal: false
    };

    handleDisplayImage = filename => {
        this.setState({
            imageName: filename,
            showModal: !this.state.showModal
        });
    };

    render() {
        const {
            categoryList,
            searchTerm,
            sortAl,
            loading,
            deleteOne,
            editOne
        } = this.props;

        let total = 0;
        const currentPort = window.location.href.replace(
            /https?:\/\/localhost:(\d{4})\//,
            "$1"
        );
        const filePathDev = "./dist/images/uploads/";
        const filePathProd = "./images/uploads/";

        return (
            <div>
                <div
                    className={`modal ${this.state.showModal ? "active" : ""}`}
                >
                    <div
                        className="modal-background"
                        onClick={this.handleDisplayImage}
                    ></div>
                    <div className="modal-content">
                        <img
                            src={`${
                                currentPort === "3000"
                                    ? filePathDev
                                    : filePathProd
                            }${this.state.imageName}`}
                            alt={this.state.imageName}
                        />
                    </div>
                    <button
                        className="modal-close is-large"
                        onClick={this.handleDisplayImage}
                    ></button>
                </div>
                <table className="table is-bordered is-striped">
                    <thead>
                        <tr className="has-background-link">
                            <th className="has-text-white">Index</th>
                            <th className="has-text-white">Category</th>
                            <th className="has-text-white">Subcategory</th>
                            <th className="has-text-white thumbnail">
                                Thumbnail
                            </th>
                            <th className="has-text-white status">Status</th>
                            <th className="has-text-white action">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryList
                            .sort((a, b) => {
                                return sortAl
                                    ? a.name.localeCompare(b.name)
                                    : a.id - b.id;
                            })
                            .map(category =>
                                category.subcategories
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
                                                <td>{category.name}</td>
                                                <td>{fw.name}</td>
                                                <td className="thumbnail">
                                                    {loading ? (
                                                        "Loading..."
                                                    ) : (
                                                        <img
                                                            className="subcategory-img"
                                                            onClick={() =>
                                                                this.handleDisplayImage(
                                                                    fw.filename
                                                                )
                                                            }
                                                            src={`${
                                                                currentPort ===
                                                                "3000"
                                                                    ? filePathDev
                                                                    : filePathProd
                                                            }${fw.filename}`}
                                                            alt={fw.name}
                                                        />
                                                    )}
                                                </td>
                                                <td className="status">
                                                    {fw.status ? (
                                                        <span className="icon has-text-link">
                                                            <i className="fas fa-check"></i>
                                                        </span>
                                                    ) : null}
                                                </td>
                                                <td className="action">
                                                    <span className="action-button-container">
                                                        <button
                                                            className="button is-warning"
                                                            onClick={() =>
                                                                editOne(fw.id)
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="button is-danger"
                                                            onClick={() =>
                                                                deleteOne(
                                                                    category.name,
                                                                    fw.name,
                                                                    fw.filename
                                                                )
                                                            }
                                                        >
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
            </div>
        );
    }
}

export default List;
