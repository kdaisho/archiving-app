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
    fs.readFile("./data/members.json", (error, data) => {
        if (error) throw error;
        data = JSON.parse(data);
        res.send(data["members"]);
    });
});

app.post("/api/addMember", (req, res) => {
    const origin = fs.readFileSync("./data/members.json");
    const jsonObj = JSON.parse(origin);

    createObj(jsonObj["members"], req.body);

    function createObj(array, obj) {
        const newId = array.length + 1;
        obj.id = newId;
        jsonObj["members"].push(obj);
        fs.writeFile(
            "./data/members.json",
            JSON.stringify(jsonObj, null, 4),
            error => {
                if (error) {
                    throw error;
                }

                console.log("Success");
                res.send(jsonObj);
            }
        );
    }
});

app.listen(process.env.PORT || 8080, () =>
    console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
