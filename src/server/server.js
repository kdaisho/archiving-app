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

app.post("/api/addFramework", (req, res) => {
    const origin = fs.readFileSync("./data/programings.json");
    const jsonObj = JSON.parse(origin);
    console.log("REQ.BODY", req.body, jsonObj);

    createLang(jsonObj["langs"], req.body.langName);
    // createObj(jsonObj["frameworks"], req.body);

    function createLang(array, langName) {
        const obj = {};
        obj.id = array.length;
        obj.name = langName;
        obj.identifier = langName.replace(/\s+/g, "").toLowerCase();
        jsonObj["langs"].push(obj);
        fs.writeFile(
            "./data/programings.json",
            JSON.stringify(jsonObj, null, 4),
            error => {
                if (error) {
                    throw error;
                }

                console.log("Success");
                createObj(jsonObj["frameworks"], req.body.frameworkName);
                res.send(jsonObj);
            }
        );
    }
    function createObj(array, frameworkName) {
        const obj = {};
        obj.id = array.length;
        obj.name = frameworkName;
        jsonObj["frameworks"].push(obj);
        fs.writeFile(
            "./data/programings.json",
            JSON.stringify(jsonObj, null, 4),
            error => {
                if (error) {
                    throw error;
                }

                console.log("Success Freamework");
                // res.send(jsonObj);
            }
        );
    }
});

app.listen(process.env.PORT || 8080, () =>
    console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
