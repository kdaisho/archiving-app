const fs = require("fs");
const readline = require("readline");
const { stdin, stdout } = require("process");
const path = require("path");

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
        console.log("Cannot create an application without a name");
        process.exit();
    }
    const applicationPath = path.join(
        __dirname,
        `data/applications/${appName}.json`
    );
    const imagePath = path.join(__dirname, `dist/images/uploads/${appName}/`);

    if (fs.existsSync(applicationPath) || fs.existsSync(imagePath)) {
        console.log(`${enteredName} already exists`);
        process.exit(0);
    }

    console.log(`Creating a new application file: ${appName}`);
    fs.writeFileSync(applicationPath, "[]");
    fs.mkdirSync(imagePath);

    const data = fs.readFileSync(dataFilePath, "utf8");
    const jsonData = JSON.parse(data);
    for (let key in jsonData) {
        if (key === appName) {
            console.log(`${appName} already exists`);
            process.exit(0);
        }
    }
    jsonData[appName] = {
        appId: appName,
        name: enteredName,
        category: "Category",
        subcategory: "Subcategory"
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 4));

    console.log(`Created a data object: ${appName}`);

    interfaceInstance.question("What is category name? ", onCategoryNameInput);
};

const createCategoryName = (enteredName, isCategory) => {
    let name = enteredName;
    if (name === "") {
        console.log(
            `Setting default ${isCategory ? "category" : "subcategory"} name.`
        );
        process.exit(0);
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
    isCategory
        ? interfaceInstance.question(
              "What is subcategory name? ",
              onSubcategoryNameInput
          )
        : console.log(`New application has been set`);
};

const onApplicationInput = name => {
    createApplicationDirectory(name);
};

const onCategoryNameInput = name => {
    createCategoryName(name, true);
};

const onSubcategoryNameInput = name => {
    interfaceInstance.close();
    stdin.destroy();
    createCategoryName(name, false);
};

interfaceInstance.question(
    "What is the name of application? ",
    onApplicationInput
);
