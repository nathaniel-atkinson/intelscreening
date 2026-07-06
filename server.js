const express = require("express");
const path = require("path");
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static("public"));


//---PATHS---
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "public", "pages", "home", "index.html"));
})
app.get('/home', (req,res) => {res.redirect('/');})

app.get("/:page", (req, res) => {
    const file = path.join(
        __dirname,
        "public",
        "pages",
        req.params.page,
        "index.html"
    );

    res.sendFile(file, err => {
        if (err) {
            res.sendFile(path.join(__dirname, "public", "pages", "404", "index.html"));
        }
    });
});

app.get('/:page/script', (req,res) => {
    const file = path.join(
        __dirname,
        "public",
        "pages",
        req.params.page,
        "script.js");

    res.sendFile(file, err => {
        if (err) {
            res.sendFile(path.join(__dirname, "public", "pages", "404", "index.html"));
        }
    });
});

app.get('/:page/style', (req,res) => {
    const file = path.join(
        __dirname,
        "public",
        "pages",
        req.params.page,
        "styles.css");

    res.sendFile(file, err => {
        if (err) {
            res.sendFile(path.join(__dirname, "public", "pages", "404", "index.html"));
        }
    });
});

app.get("/:page/data", (req,res) => {
    const file = path.join(
        __dirname,
        "public",
        "files",
        req.params.page,
        "intel.db"
    );

    res.sendFile(file, err => {
        if (err) {
            res.sendFile(path.join(__dirname, "public", "pages", "404", "index.html"));
        }
    });
});

//---GLOBAL RESOURCES---
app.get('/g/script', (req, res) => {
    const file = path.join(__dirname, "public", "global", "script.js");

    console.log(file);
    console.log(fs.existsSync(file));

    res.sendFile(file, err => {
        if (err) {
            console.error(err);
            res.status(404).send(err.message);
        }
    });
});

app.get('/g/style', (req,res) => {
    res.sendFile(path.join(__dirname, "public", "global", "styles.css"))
})


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});