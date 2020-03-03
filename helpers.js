const fs = require("fs");
const path = require("path");

const deleteFile = (appId, file) => {
    const filePath = path.join(__dirname, `./dist/images/uploads/${appId}/`);
    if (fs.existsSync(filePath + file)) {
        fs.unlink(
            path.join(__dirname, `./dist/images/uploads/${appId}/${file}`),
            error => {
                if (error) throw error;
                console.log(`${file} deleted!`);
            }
        );
    }
};

const writeItem = (dataString, appId, ts, fn) => {
    fs.writeFileSync(
        path.join(__dirname, `./data/applications/${appId}.json`),
        dataString
    );
    return fn(appId, ts);
};

const setLastUpdated = (appId, ts) => {
    return new Promise((resolve, reject) => {
        fs.readFile(
            path.join(__dirname, `./data/applications.json`),
            (error, data) => {
                if (error) {
                    throw error;
                } else {
                    data = JSON.parse(data);
                    data[appId].lastUpdated = ts;
                    resolve(
                        fs.writeFileSync(
                            path.join(__dirname, `./data/applications.json`),
                            JSON.stringify(data, null, 4)
                        )
                    );
                }
            }
        );
    });
};

const helpers = {
    deleteFile,
    writeItem,
    setLastUpdated
};

module.exports = helpers;
