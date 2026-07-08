const express = require('express');
const path = require('path');
const fs = require("fs/promises");
const sqlite3 = require('sqlite3');
const { open } = require("sqlite");

const app = express();
const PORT = 3525;

//---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const lrserver = livereload.createServer();
lrserver.watch(path.join(__dirname, "public"));
app.use(connectLiveReload());

//---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const database = require("./data/database.js");
app.get('/api/database/test' , async (req,res) => {
    const exists = await database.databaseExists();
    res.json({ exists });
})

app.post('/api/database/createdirectory' , async (req,res) => {
    try {
        await database.initializeDirectory();
        res.json({ created: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ created: false });
    }
})

app.post('/api/database/deleteDirectory' , async (req,res) => {
    try {
        await database.removeDirectory();
        res.json({ deleted: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ deleted: false });
    }
})

//---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

app.use(express.static("public"));

//---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "public", "home", "index.html"));
})

app.get('/home', (req,res) => {res.redirect('/');})

app.get('/:page', (req,res) => {
    const file = path.join(
        __dirname,
        "public",
        req.params.page,
        "index.html"
    );

    res.sendFile(file, (err) => {
        if (err) {
            res.status(404).sendFile(
                path.join(__dirname, "public", "404.html")
            );
        }
    })
})

app.get('/api/scripts/:page', (req,res) => {
    const file = path.join(
        __dirname,
        "public",
        req.params.page,
        "script.js"
    )

    res.sendFile(file, (err) => {
        if (err) {
            res.status(404).sendFile(
                path.join(__dirname, "public", "404.html")
            );
        }
    })
})

app.get('/api/styles/:page', (req,res) => {
    const file = path.join(
        __dirname,
        "public",
        req.params.page,
        "styles.css"
    )

    res.sendFile(file, (err) => {
        if (err) {
            res.status(404).sendFile(
                path.join(__dirname, "public", "404.html")
            );
        }
    })
})

app.get('/api/global/scripts', (req,res) => {
    res.sendFile(path.join(__dirname, "public", "global", "scripts.js"))
})

app.get('/api/global/styles', (req,res) => {
    res.sendFile(path.join(__dirname, "public", "global", "styles.css"))
})


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
