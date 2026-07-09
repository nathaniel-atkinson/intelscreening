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

app.get('/api/directory/lists', async (req,res) => {
    try {
        const lists = await database.listDirectoryLists();
        res.json({ lists });
    } catch (error) {
        console.error(error);
        res.status(500).json({ lists: [] });
    }
})

app.post('/api/directory/lists', async (req,res) => {
    try {
        const created = await database.createDirectoryList(req.body);
        res.json({ created });
    } catch (error) {
        console.error(error);
        res.status(500).json({ created: false });
    }
})

app.get('/api/directory/folders', async (req,res) => {
    try {
        const listId = req.query.listId ? Number(req.query.listId) : null;
        const folders = await database.listDirectoryFolders({ listId });
        res.json({ folders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ folders: [] });
    }
})

app.post('/api/directory/folders', async (req,res) => {
    try {
        const created = await database.createDirectoryFolder(req.body);
        res.json({ created });
    } catch (error) {
        console.error(error);
        res.status(500).json({ created: false });
    }
})

app.post('/api/directory/folders/move', async (req,res) => {
    try {
        const moved = await database.moveDirectoryFolder(req.body);
        res.json({ moved });
    } catch (error) {
        console.error(error);
        res.status(500).json({ moved: false });
    }
})

app.get('/api/database/list', async (req,res) => {
    try {
        const listId = req.query.listId ? Number(req.query.listId) : null;
        const databases = await database.listDatabases({ listId });
        res.json({ databases });
    } catch (error) {
        console.error(error);
        res.status(500).json({ databases: [] });
    }
})

app.post('/api/database/createdatabase', async (req,res) => {
    try {
        const created = await database.createDatabase(req.body);
        res.json({ created });
    } catch (error) {
        console.error(error);
        res.status(500).json({ created: false });
    }
})

app.post('/api/database/move', async (req,res) => {
    try {
        const moved = await database.moveDatabase(req.body);
        res.json({ moved });
    } catch (error) {
        console.error(error);
        res.status(500).json({ moved: false });
    }
})

app.post('/api/database/delete', async (req,res) => {
    try {
        const deleted = await database.deleteDatabase(req.body);
        res.json({ deleted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ deleted: false });
    }
})

app.get('/api/database/tables', async (req,res) => {
    try {
        const tables = await database.listTables({
            databaseId: Number(req.query.databaseId)
        });
        res.json({ tables });
    } catch (error) {
        console.error(error);
        res.status(500).json({ tables: [] });
    }
})

app.post('/api/database/createtable', async (req,res) => {
    try {
        const created = await database.createTable(req.body);
        res.json({ created });
    } catch (error) {
        console.error(error);
        res.status(500).json({ created: false });
    }
})

app.get('/api/database/table-fields', async (req,res) => {
    try {
        const fields = await database.listTableFields({
            databaseId: Number(req.query.databaseId),
            tableName: req.query.tableName
        });
        res.json({ fields });
    } catch (error) {
        console.error(error);
        res.status(500).json({ fields: [] });
    }
})

app.post('/api/database/table-fields', async (req,res) => {
    try {
        const updated = await database.updateTableFields(req.body);
        res.json({ updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ updated: false });
    }
})

app.get('/api/database/records', async (req,res) => {
    try {
        const records = await database.listRecords({
            databaseId: Number(req.query.databaseId),
            tableName: req.query.tableName
        });
        res.json({ records });
    } catch (error) {
        console.error(error);
        res.status(500).json({ records: [] });
    }
})

app.post('/api/record/create', async (req,res) => {
    try {
        const created = await database.createRecord(req.body);
        res.json({ created });
    } catch (error) {
        console.error(error);
        res.status(500).json({ created: false });
    }
})

app.post('/api/record/create-file', async (req,res) => {
    try {
        const created = await database.createFileRecord(req.body);
        res.json({ created });
    } catch (error) {
        console.error(error);
        res.status(500).json({ created: false });
    }
})

app.get('/api/record/file', async (req,res) => {
    try {
        const file = await database.readRecordFile({
            databaseId: Number(req.query.databaseId),
            tableName: req.query.tableName,
            recordId: Number(req.query.recordId)
        });
        res.json({ file });
    } catch (error) {
        console.error(error);
        res.status(500).json({ file: null });
    }
})

app.post('/api/record/update', async (req,res) => {
    try {
        const updated = await database.updateRecord(req.body);
        res.json({ updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ updated: false });
    }
})

app.post('/api/record/delete', async (req,res) => {
    try {
        const deleted = await database.deleteRecord(req.body);
        res.json({ deleted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ deleted: false });
    }
})

app.post('/api/record/move-table', async (req,res) => {
    try {
        const moved = await database.moveRecordToTable(req.body);
        res.json({ moved });
    } catch (error) {
        console.error(error);
        res.status(500).json({ moved: false });
    }
})

app.post('/api/record/move-database', async (req,res) => {
    try {
        const moved = await database.moveRecordToDatabase(req.body);
        res.json({ moved });
    } catch (error) {
        console.error(error);
        res.status(500).json({ moved: false });
    }
})

app.get('/api/related/list', async (req,res) => {
    try {
        const listId = req.query.listId ? Number(req.query.listId) : null;
        const related = await database.listRelatedItems({ listId });
        res.json({ related });
    } catch (error) {
        console.error(error);
        res.status(500).json({ related: [] });
    }
})

app.post('/api/related/create', async (req,res) => {
    try {
        const created = await database.createRelatedItem(req.body);
        res.json({ created });
    } catch (error) {
        console.error(error);
        res.status(500).json({ created: false });
    }
})

//---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

app.use(express.static("public"));

//---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "public", "home", "index.html"));
})

app.get('/home', (req,res) => {res.redirect('/');})

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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
