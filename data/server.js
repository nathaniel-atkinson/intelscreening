const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite = require('sqlite');
const { open } = require("sqlite");

const app = express();


const table = await db.get(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
      AND name = ?
`, ["users"]);

if (table) {
    console.log("Table exists.");
} else {
    console.log("Table does not exist.");
}

async function getDatabase(path) {
    return await open({
        filename: path,
        // your configured driver
    });
}

module.exports = { getDatabase };