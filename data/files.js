const path = require("path");
const fs = require("fs/promises");
const crypto = require("crypto");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { write } = require("fs");

const { writeFile, readFile } = fs;

async function readDir() {
    const folder = path.join(__dirname,'..','public','Files');
    const entries = await fs.readdir(folder,{ withFileTypes: true })


    return entries
        .filter(entry => entry.isFile())
        .map(entry => path.join(folder, entry.name));

}

async function readFiles(data) {
    try {
        const contents = await readFile(
            `./public/files/${data.name}.${data.type}`,
            "utf8"
        );

        console.log(contents);
        return contents;
    } catch (err) {
        console.error(err);
    }
}

async function createFile(data) {
    const file = path.join(
        __dirname,
        '..',
        'public',
        "Files",
        `${data.name}.${data.type}`
    );

    console.log("Creating:", file);

    await writeFile(file, "", "utf8");

    return true;
}

module.exports = {
    createFile,
    readFile,
    readDir
}