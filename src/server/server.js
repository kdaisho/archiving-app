const express = require("express");
const os = require("os");
const fs = require("fs");

const app = express();

app.use(express.static("dist"));

app.get("/api/getUsername", (req, res) => {
    res.send({ username: os.userInfo().username });
});

app.get("/action/sayHi", (req, res) => {
    // console.log("yo", typeof archive);
    res.send("Holaa action 2");
});

app.get("/action/write/:name", (req, res) => {
    const data = req.params;
    const name = data.name;
    console.log("NAME", name);
    const d = fs.readFileSync("./data/archive.json");
    const y = JSON.parse(d);
    createObj(y["archives"], name);

    function createObj(array, name) {
        const newId = array.length + 1;
        const obj = {};
        obj.id = newId;
        obj.name = name;
        y["archives"].push(obj);
        // const newY = JSON.stringify(y, null, 4);
        fs.writeFile(
            "./data/archive.json",
            JSON.stringify(y, null, 4),
            error => {
                if (error) {
                    console.error("ERROR:", error);
                    return false;
                }

                console.log("Success");
                res.send(y);
            }
        );
    }
});

app.listen(process.env.PORT || 8080, () =>
    console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
