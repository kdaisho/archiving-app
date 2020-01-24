const express = require("express");
const fs = require("fs");

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

app.post("/api/add", (req, res) => {
    const origin = fs.readFileSync("./data/programings.json");
    const langArray = JSON.parse(origin);

    sendData(langArray, req.body);

    function sendData(array, reqObj) {
        handleDuplicate(array, reqObj);

        fs.writeFile(
            "./data/programings.json",
            JSON.stringify(array, null, 4),
            error => {
                if (error) {
                    throw error;
                }

                console.log("Success");
                res.json(array);
            }
        );
    }

    function handleDuplicate(targetArray, reqObj) {
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
                        return false;
                    }
                }
                targetArray[i].frameworks.push(
                    getFwObj(
                        targetArray[i].frameworks.length,
                        reqObj.frameworkName
                    )
                );
                return false;
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
    }
});

app.listen(process.env.PORT || 8080, () =>
    console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
