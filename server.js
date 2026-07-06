const express = require(express);
const path = require(path);
const fs = require(fs);
const sqlite = require(sqlite);

const app = express();
const port = 3525;

app.use(express.static("public"));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "public", "home"));
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
        res.redirect(path.join(__dirname, "public", "404.html"))
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