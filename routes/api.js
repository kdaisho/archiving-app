const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const jimp = require("jimp");

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");
const router = express.Router();
const { deleteFile } = require("../helpers");

router.get("/getList", (req, res) => {
    fs.readFile(
        path.join(__dirname, "../data/programings.json"),
        (error, data) => {
            if (error) throw error;
            data = JSON.parse(data);
            res.send(data);
        }
    );
});

router.post("/upload", (req, res) => {
    upload(req, res, error => {
        if (error) {
            return res.status(500).json(error);
        }
        //Reading image from buffer so that Jimp can resize
        //Buffer is available when storage instance is created from memoryStorage instead of diskStorage
        jimp.read(req.file.buffer)
            .then(img => {
                const width = img.bitmap.width > 960 ? 960 : img.bitmap.width;
                return img
                    .resize(width, jimp.AUTO)
                    .quality(70)
                    .write(
                        `${path.join(__dirname, "../dist/images/uploads/")}${
                            req.body.fileName
                        }`,
                        (error, response) => {
                            if (error) throw error;
                            res.status(200).send(req.file);
                        }
                    );
            })
            .catch(error => console.error(error));
    });
});

router.post("/add", (req, res) => {
    const data = getResolvedData(
        JSON.parse(
            fs.readFileSync(path.join(__dirname, "../data/programings.json"))
        ),
        req.body
    );

    fs.writeFile(
        path.join(__dirname, "../data/programings.json"),
        JSON.stringify(data, null, 4),
        error => {
            if (error) {
                throw error;
            }

            console.log("New category added!", data);
            res.json(data, null, 4);
        }
    );

    function getResolvedData(targetArray, reqObj) {
        const getCategoryObj = (id, name) => {
            return (obj = { id, name, subcategories: [] });
        };

        const getSubcatObj = (id, name, filename, status) => {
            return (obj = { id, name, filename, status });
        };

        for (let i = 0; i < targetArray.length; i++) {
            if (
                targetArray[i].name.toLowerCase() ===
                reqObj.category.toLowerCase()
            ) {
                for (let j = 0; j < targetArray[i].subcategories.length; j++) {
                    if (
                        targetArray[i].subcategories[j].name.toLowerCase() ===
                            reqObj.subcategory.toLowerCase() &&
                        !reqObj.editing
                    ) {
                        return targetArray;
                    } else if (
                        targetArray[i].subcategories[j].name.toLowerCase() ===
                            reqObj.subcategory.toLowerCase() &&
                        reqObj.editing &&
                        reqObj.fileName
                    ) {
                        const returnedObj = Object.assign(
                            targetArray[i].subcategories[j],
                            getSubcatObj(
                                targetArray[i].subcategories[j].id,
                                targetArray[i].subcategories[j].name,
                                reqObj.fileName,
                                reqObj.status
                            )
                        );
                        targetArray[i].subcategories[j] = returnedObj;
                        return targetArray;
                    }
                }
                targetArray[i].subcategories.push(
                    getSubcatObj(
                        reqObj.id,
                        reqObj.subcategory,
                        reqObj.fileName,
                        reqObj.status
                    )
                );
                return targetArray;
            }
        }

        const categoryObj = getCategoryObj(reqObj.id, reqObj.category);

        categoryObj.subcategories.push(
            getSubcatObj(
                reqObj.id,
                reqObj.subcategory,
                reqObj.fileName,
                reqObj.status
            )
        );

        targetArray.push(categoryObj);
        return targetArray;
    }
});

router.delete("/delete", (req, res) => {
    const { category, subcategory, image } = req.body;

    fs.readFile(
        path.join(__dirname, "../data/programings.json"),
        (error, data) => {
            if (error) throw error;
            data = JSON.parse(data).slice();
            const [cat] = data.filter(cat => {
                return cat.name === category;
            });
            cat.subcategories = cat.subcategories.filter(
                subcat => subcat.name !== subcategory
            );

            deleteFile(image);

            fs.writeFile(
                path.join(__dirname, "../data/programings.json"),
                JSON.stringify(
                    removeCategoryWithNoSubcategory(data, cat),
                    null,
                    4
                ),
                error => {
                    if (error) {
                        throw error;
                    }
                    res.json(data, null, 4);
                }
            );
        }
    );

    function removeCategoryWithNoSubcategory(data, cat) {
        if (cat.subcategories.length <= 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].name === cat.name) {
                    data.splice(i, 1);
                }
            }
        }
        return data;
    }
});

router.get("/edit/:id", (req, res) => {
    let category = {};
    const returnSubcat = [];
    fs.readFile(
        path.join(__dirname, "../data/programings.json"),
        (error, data) => {
            if (error) throw error;
            data = JSON.parse(data).slice();
            data.forEach((cat, i) => {
                cat.subcategories.forEach(subcat => {
                    if (subcat.id.toString() === req.params.id) {
                        category = data[i];
                        returnSubcat.push(subcat);
                        category.subcategories = returnSubcat;
                    }
                });
            });
            res.json(category);
        }
    );
});

router.post("/edit/:id", (req, res) => {
    fs.readFile(
        path.join(__dirname, "../data/programings.json"),
        (error, data) => {
            if (error) throw error;
            data = JSON.parse(data).slice();
            data.forEach((cat, i) => {
                cat.subcategories.forEach((subcat, index) => {
                    if (subcat.id.toString() === req.params.id) {
                        subcat.name = req.body.subcategory;
                        subcat.status = req.body.status;
                        if (req.body.fileName) {
                            deleteFile(subcat.filename);
                            subcat.filename = req.body.fileName;
                        }
                        cat.subcategories[index] = subcat;
                        data[i] = cat;
                    }
                });
            });

            fs.writeFile(
                path.join(__dirname, "../data/programings.json"),
                JSON.stringify(data, null, 4),
                error => {
                    if (error) {
                        throw error;
                    }
                    res.json(data);
                }
            );
        }
    );
});

module.exports = router;
