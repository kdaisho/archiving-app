const express = require("express");
const fs = require("fs");
const multer = require("multer");
const app = express();

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

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/uploads/");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage }).single("file");

app.post("/api/upload", (req, res) => {
    upload(req, res, error => {
        if (error instanceof multer.MulterError) {
            return res.status(500).json(error);
        } else if (error) {
            return res.status(500).json(error);
        }
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

            console.log("New language successfully uploaded!", data);
            res.json(data, null, 4);
        }
    );

    function getResolvedData(targetArray, reqObj) {
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
                        reqObj.frameworkName
                    )
                );
                return targetArray;
            }
        }

        const langObj = getLangObj(targetArray.length, reqObj.langName);
        langObj.frameworks.push(
            getFwObj(langObj.frameworks.length, reqObj.frameworkName)
        );

        function getLangObj(id, name) {
            return (obj = { id, name, frameworks: [] });
        }

        function getFwObj(id, name) {
            return (obj = { id, name });
        }

        targetArray.push(langObj);
        return targetArray;
    }
});

app.listen(process.env.PORT || 8080, () =>
    console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
