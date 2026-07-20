const express = require('express');
const path = require('path');

const app = express();
const PORT = 3525;

app.use(express.json({ limit: "25mb" }));

//---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const lrserver = livereload.createServer();
lrserver.watch(path.join(__dirname, "public"));
app.use(connectLiveReload());

//---SQLITE---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const database = require('./data/database.js');

app.post('/api/database/testfor/directory', async (req,res) => {
    await database.directoryExists();
})

app.post('/api/database/initialiseDatabase', async (req,res) => {
    try {
        await database.initialiseDirectory();
        res.json({create: true});
    } catch (err) {

    }
})

//---MAIN---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

app.get('/', (req,res) => {
    const file = path.join(
        __dirname,
        "public",
        "home",
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

app.get('/api/global/scripts', (req,res) => {
    res.sendFile(path.join(
        __dirname,
        'public',
        'global',
        'scripts.js'
    ))
})

app.get('/api/global/styles', (req,res) => {
    res.sendFile(path.join(
        __dirname,
        'public',
        'global',
        'styles.css'
    ))
})


app.get('/home/scripts.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home', 'scripts.js'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});