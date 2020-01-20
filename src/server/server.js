const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.static("dist"));

app.get("/api/getList", (req, res) => {
    fs.readFile("./data/archive.json", (error, data) => {
        if (error) throw error;
        data = JSON.parse(data);
        res.send(data["archives"]);
    });
});

app.get("/action/sayHi", (req, res) => {
    res.send("Holaa action 2");
});

app.get("/action/write/:name", (req, res) => {
    const data = req.params;
    const name = data.name;
    const d = fs.readFileSync("./data/archive.json");
    const y = JSON.parse(d);
    createObj(y["archives"], name);

    function createObj(array, name) {
        const newId = array.length + 1;
        const obj = {};
        obj.id = newId;
        obj.name = name;
        y["archives"].push(obj);
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
