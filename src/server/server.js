const express = require("express");
const apiRoutes = require("../../routes/api");

const app = express();

app.use(express.static("dist"));

//Enabling built-in body parser
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

app.use("/api", apiRoutes);

app.listen(process.env.PORT || 8080, () =>
    console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
