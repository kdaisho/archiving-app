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
                const fw = {};
                fw.id = targetArray[i].frameworks.length;
                fw.name = reqObj.frameworkName;
                targetArray[i].frameworks.push(fw);
                return false;
            }
        }
        const obj = {};
        obj.id = targetArray.length;
        obj.name = reqObj.langName;
        obj.frameworks = [];
        const frameworkObj = {};
        frameworkObj.name = reqObj.frameworkName;
        frameworkObj.id = obj.frameworks.length;
        obj.frameworks.push(frameworkObj);
        targetArray.push(obj);
    }
});

app.listen(process.env.PORT || 8080, () =>
    console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
