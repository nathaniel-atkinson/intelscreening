const express = require('express');
const path = require('path');
const fs = require("fs/promises");

const sqlite = require('sqlite');
const sqlite3 = require("sqlite3");

const { open } = require("sqlite");
const { table } = require('console');


const app = express();

const dbPath = path.join(__dirname, "directory.db");

async function databaseExists() {
    try {
        await fs.access(dbPath);
        return true;
    } catch {
        return false;
    }
}

let db;
async function initializeDirectory() {
    if (db) return db;

    db = await open({
        filename: path.join(__dirname, "directory.db"),
        driver: sqlite3.Database
    });

    return db;
}

async function removeDirectory() {
    if (db) {
        await db.close();
        db = null;
    }

    try {
        await fs.unlink(dbPath);
    } catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }
    }
}

async function createDatabase() {
    
}

module.exports = { 
    databaseExists,
    initializeDirectory,
    removeDirectory
};