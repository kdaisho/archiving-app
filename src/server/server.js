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

    sendData(jsonObj["langs"], req.body.langName, "langs");
    sendData(jsonObj["frameworks"], req.body.frameworkName, "frameworks");

    function sendData(array, name, type) {
        const obj = {};
        obj.id = array.length;
        obj.name = name;
        type === "langs"
            ? (obj.identifier = name.replace(/\s+/g, "").toLowerCase())
            : null;
        jsonObj[type].push(obj);

        fs.writeFile(
            "./data/programings.json",
            JSON.stringify(jsonObj, null, 4),
            error => {
                if (error) {
                    throw error;
                }

                console.log("Success");
            }
        );
    }

    res.send(jsonObj);
});

app.listen(process.env.PORT || 8080, () =>
    console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
