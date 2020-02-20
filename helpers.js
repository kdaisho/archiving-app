const fs = require("fs");
const path = require("path");

const deleteFile = filename => {
    fs.unlink(
        path.join(__dirname, `./dist/images/uploads/${filename}`),
        error => {
            if (error) throw error;
            console.log(`${filename} deleted!`);
        }
    );
};

const helpers = {
    deleteFile
};

module.exports = helpers;
