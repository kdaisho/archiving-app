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
                        }`
                    );
            })
            .catch(error => console.error(error));

        return res.status(200).send(req.file);
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

            console.log("New language added!", data);
            res.json(data, null, 4);
        }
    );

    function getResolvedData(targetArray, reqObj) {
        const getLangObj = (id, name) => {
            return (obj = { id, name, frameworks: [] });
        };

        const getFwObj = (id, name, filename, done) => {
            return (obj = { id, name, filename, done });
        };

        for (let i = 0; i < targetArray.length; i++) {
            if (
                targetArray[i].name.toLowerCase() ===
                reqObj.langName.toLowerCase()
            ) {
                for (let j = 0; j < targetArray[i].frameworks.length; j++) {
                    if (
                        targetArray[i].frameworks[j].name.toLowerCase() ===
                            reqObj.frameworkName.toLowerCase() &&
                        !reqObj.editing
                    ) {
                        return targetArray;
                    } else if (
                        targetArray[i].frameworks[j].name.toLowerCase() ===
                            reqObj.frameworkName.toLowerCase() &&
                        reqObj.editing &&
                        reqObj.fileName
                    ) {
                        const returnedObj = Object.assign(
                            targetArray[i].frameworks[j],
                            getFwObj(
                                targetArray[i].frameworks[j].id,
                                targetArray[i].frameworks[j].name,
                                reqObj.fileName,
                                reqObj.done
                            )
                        );
                        targetArray[i].frameworks[j] = returnedObj;
                        return targetArray;
                    }
                }
                targetArray[i].frameworks.push(
                    getFwObj(
                        reqObj.id,
                        reqObj.frameworkName,
                        reqObj.fileName,
                        reqObj.done
                    )
                );
                return targetArray;
            }
        }

        const langObj = getLangObj(reqObj.id, reqObj.langName);

        langObj.frameworks.push(
            getFwObj(
                reqObj.id,
                reqObj.frameworkName,
                reqObj.fileName,
                reqObj.done
            )
        );

        targetArray.push(langObj);
        return targetArray;
    }
});

router.delete("/delete", (req, res) => {
    const { langName, fwName, image } = req.body;

    fs.readFile(
        path.join(__dirname, "../data/programings.json"),
        (error, data) => {
            if (error) throw error;
            data = JSON.parse(data).slice();
            const [lang] = data.filter(lang => {
                return lang.name === langName;
            });
            lang.frameworks = lang.frameworks.filter(fw => fw.name !== fwName);

            deleteFile(image);

            fs.writeFile(
                path.join(__dirname, "../data/programings.json"),
                JSON.stringify(removeLangWithNoFramework(data, lang), null, 4),
                error => {
                    if (error) {
                        throw error;
                    }
                    res.json(data, null, 4);
                }
            );
        }
    );

    function removeLangWithNoFramework(data, lang) {
        if (lang.frameworks.length <= 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].name === lang.name) {
                    data.splice(i, 1);
                }
            }
        }
        return data;
    }
});

router.get("/edit/:id", (req, res) => {
    let lang = {};
    const returnFw = [];
    fs.readFile(
        path.join(__dirname, "../data/programings.json"),
        (error, data) => {
            if (error) throw error;
            data = JSON.parse(data).slice();
            data.forEach((l, i) => {
                l.frameworks.forEach(fw => {
                    if (fw.id.toString() === req.params.id) {
                        lang = data[i];
                        returnFw.push(fw);
                        lang.frameworks = returnFw;
                    }
                });
            });
            res.json(lang);
        }
    );
});

router.post("/edit/:id", (req, res) => {
    fs.readFile(
        path.join(__dirname, "../data/programings.json"),
        (error, data) => {
            if (error) throw error;
            data = JSON.parse(data).slice();
            data.forEach((l, i) => {
                l.frameworks.forEach((fw, index) => {
                    if (fw.id.toString() === req.params.id) {
                        fw.name = req.body.frameworkName;
                        fw.done = req.body.done;
                        if (req.body.fileName) {
                            deleteFile(fw.filename);
                            fw.filename = req.body.fileName;
                        }
                        l.frameworks[index] = fw;
                        data[i] = l;
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
