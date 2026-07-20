const path = require("path");
const fs = require("fs/promises");
const crypto = require("crypto");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const dbPath = path.join(__dirname, "directory.db");
const databasesDir = path.join(__dirname, "databases");
const filesDir = path.join(__dirname, "files");

let db;


function createRandId() {
    return crypto.randomInt(100000000, 999999999);
}

async function directoryExists() {
    try {
        await fs.access(dbPath);
        return true;
    } catch {
        return false;
    }
}

async function initialiseDirectory() {
    if (db) return db;

    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY,
            name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)

    return db;
}


module.exports = {
    directoryExists,
    initialiseDirectory
}