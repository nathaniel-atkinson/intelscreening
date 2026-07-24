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
    console.log("POST /api/database/status");
    const exists = await database.directoryExists();

    res.json({
        exists
    });
})

app.post('/api/database/initialise', async (req,res) => {
    console.log("POST /api/database/initialise");
    try {
        const status = await database.initialiseDirectory();
        res.json({status});
    } catch (err) {
        console.error(err);

        res.status(500).json({
            status,
            error: err.message
        });
    }
})

app.post('/api/database/delete', async (req,res) => {
    console.log("POST /api/database/delete");
    try {
        const status = await database.deleteDirectory();
        res.json({status});
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
})

//---FAVICON---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

app.use('/api/favicon', express.static(path.join(__dirname, 'public', 'Files', 'favicon')));

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

app.get('/home', (req,res) => res.redirect(301, '/'))


app.get('/:page/scripts.js', (req, res) => {
    const file = path.join(__dirname, 'public', req.params.page, 'scripts.js');
    if (file) res.sendFile(file);
});

app.get('/:page/styles.css', (req, res) => {
    const file = path.join(__dirname, 'public', req.params.page, 'styles.css');
    if (file) res.sendFile(file);
});

//---GLOBAL---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

app.use('/global', express.static(path.join(__dirname, 'public', 'global')));

//---PUBLIC FILES---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::





app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});