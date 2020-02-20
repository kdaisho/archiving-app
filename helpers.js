const fs = require("fs");
const path = require("path");

const deleteFile = file => {
    const filePath = path.join(__dirname, "./dist/images/uploads/");
    if (fs.existsSync(filePath + file)) {
        fs.unlink(
            path.join(__dirname, `./dist/images/uploads/${file}`),
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
