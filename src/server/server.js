const express = require("express");
const fs = require("fs");
const multer = require("multer");
const jimp = require("jimp");

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

app.use(express.static("dist"));

//Enabling built-in body parser
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

app.get("/api/getList", (req, res) => {
    fs.readFile("./data/programings.json", (error, data) => {
        if (error) throw error;
        data = JSON.parse(data);
        res.send(data);
    });
});

app.post("/api/upload", (req, res) => {
    upload(req, res, error => {
        console.log("UPLoading image", req.body.fileName);
        if (error) {
            return res.status(500).json(error);
        }
        //Reading image from buffer so that Jimp can resize
        //Buffer is available when storage instance is created from memoryStorage instead of diskStorage
        jimp.read(req.file.buffer).then(img => {
            const width = img.bitmap.width > 960 ? 960 : img.bitmap.width;
            return img
                .resize(width, jimp.AUTO)
                .quality(70)
                .write(`./dist/images/uploads/${req.body.fileName}`);
        });
        return res.status(200).send(req.file);
    });
});

app.post("/api/add", (req, res) => {
    const data = getResolvedData(
        JSON.parse(fs.readFileSync("./data/programings.json")),
        req.body
    );

    fs.writeFile(
        "./data/programings.json",
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

        const getFwObj = (id, name, filename) => {
            return (obj = { id, name, filename });
        };

        for (let i = 0; i < targetArray.length; i++) {
            if (
                targetArray[i].name.toLowerCase() ===
                reqObj.langName.toLowerCase()
            ) {
                for (let j = 0; j < targetArray[i].frameworks.length; j++) {
                    if (
                        targetArray[i].frameworks[j].name.toLowerCase() ===
                        reqObj.frameworkName.toLowerCase()
                    ) {
                        return targetArray;
                    }
                }
                targetArray[i].frameworks.push(
                    getFwObj(
                        targetArray[i].frameworks.length,
                        reqObj.frameworkName,
                        reqObj.fileName
                    )
                );
                return targetArray;
            }
        }

        const langObj = getLangObj(targetArray.length, reqObj.langName);

        langObj.frameworks.push(
            getFwObj(
                langObj.frameworks.length,
                reqObj.frameworkName,
                reqObj.fileName
            )
        );

        targetArray.push(langObj);
        return targetArray;
    }
});

app.listen(process.env.PORT || 8080, () =>
    console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
