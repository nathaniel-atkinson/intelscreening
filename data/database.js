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

module.exports = { 
    databaseExists
};