const express = require('express');
const path = require('path');

const app = express();
const PORT = 3525;

app.use(express.json({ limit: "25mb" }));
app.use(express.static(path.join(__dirname, "public")));

//---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const lrserver = livereload.createServer();
lrserver.watch(path.join(__dirname, "public"));
app.use(connectLiveReload());

//---SQLITE---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const database = require('./data/database.js');

app.post('/api/database/status', async (req,res) => {
    const exists = await database.directoryExists();

    res.json({
        exists
    });
})

app.post('/api/database/initialise', async (req,res) => {
    try {
        const db = await database.initialiseDirectory();
        if (db) res.json({create: true});
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
})

//---MAIN---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

app.get('/', (req,res) => {
    const file = path.join(
        __dirname, "public", "home", "index.html"
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
        __dirname, 'public', 'global', 'scripts.js'
    ))
})

app.get('/api/global/styles', (req,res) => {
    res.sendFile(path.join(
        __dirname, 'public', 'global', 'styles.css'
    ))
})


app.get('/:page/scripts.js', (req, res) => {
    const file = path.join(__dirname, 'public', req.params.page, 'scripts.js')
    if (file) res.sendFile(file);
});

app.get('/:page/styles.css', (req, res) => {
    const file = path.join(__dirname, 'public', req.params.page, 'styles.css')
    if (file) res.sendFile(file);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});