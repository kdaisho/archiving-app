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

const helpers = {
    deleteFile
};

module.exports = helpers;
