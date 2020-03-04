const fs = require("fs");
const readline = require("readline");
const { stdin, stdout } = require("process");
const path = require("path");
require("colors");

const interfaceInstance = readline.createInterface(stdin, stdout);
const dataFilePath = path.join(__dirname, `data/applications.json`);
let appName = "";

const trimName = name => {
    return name
        .trim()
        .replace(/\s+/, "")
        .toLowerCase();
};

const createApplicationDirectory = enteredName => {
    appName = trimName(enteredName);

    if (appName === "") {
        console.log("Cannot create an application without a name".bgBrightRed.black);
        process.exit();
    }

    const applicationPath = path.join(
        __dirname,
        `data/applications/${appName}.json`
    );

    const imagePath = path.join(__dirname, `dist/images/uploads/${appName}/`);

    if (fs.existsSync(applicationPath) || fs.existsSync(imagePath)) {
        console.log(`${enteredName} already exists`.bgBrightRed.black);
        process.exit();
    }

    if (!fs.existsSync(`./data/applications/`)) {
        fs.mkdirSync(`./data/applications/`, { recursive: true });
    }

    fs.writeFileSync(applicationPath, "[]");
    fs.mkdir(imagePath, { recursive: true }, error => {
        if (error) throw error;
    });

    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, "{}");
    }

    fs.readFile(dataFilePath, "utf8", (error, data) => {
        if (error) throw error;
        const jsonData = JSON.parse(data);
        for (let key in jsonData) {
            if (key === appName) {
                console.log(`${appName} already exists`.bgBrightRed.black);
                process.exit();
            }
        }
        jsonData[appName] = {
            appId: appName,
            name: enteredName,
            category: "Category",
            subcategory: "Subcategory"
        };

        fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 4));
    });
};

const createCategoryName = (enteredName, isCategory) => {
    let name = enteredName;
    if (name === "") {
        console.log(
            `Setup done with default ${isCategory ? "category" : "subcategory"} name!`.bgBrightGreen.black
        );
        process.exit();
    }

    const data = fs.readFileSync(dataFilePath);
    const jsonData = JSON.parse(data);
    for (let key in jsonData) {
        if (key === appName) {
            isCategory
                ? (jsonData[key].category = name)
                : (jsonData[key].subcategory = name);
            break;
        }
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 4));
};

const q1 = () => {
    return new Promise((resolve, reject) => {
        interfaceInstance.question("What is application name? ".brightYellow, answer => {
            createApplicationDirectory(answer);
            resolve();
        })
    });
};

const q2 = () => {
    return new Promise((resolve, reject) => {
        interfaceInstance.question("What is category name? ".brightYellow, answer => {
            createCategoryName(answer, true);
            resolve();
        })
    });
};

const q3 = () => {
    return new Promise((resolve, reject) => {
        interfaceInstance.question("What is subcategory name? ".brightYellow, answer => {
            createCategoryName(answer, false);
            resolve();
        })
    });
};

const main = async () => {
    await q1();
    await q2();
    await q3();
    console.log("Setup completed!".bgBrightGreen.black)
    interfaceInstance.close();
    stdin.destroy();
};

main();
