const path = require("path");
const fs = require("fs/promises");
const crypto = require("crypto");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { write } = require("fs");

const { writeFile, readFile } = fs;


async function createFile(data) {
    await writeFile(`./public/files/${data.name}.${data.type}`, '', 'utf8');
}

async function readFiles(data) {
    await readFile(`${data.name}.${data.type}`, '', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        console.log('File content:', data);
    });
}