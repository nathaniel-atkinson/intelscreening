const path = require("path");
const fs = require("fs/promises");
const crypto = require("crypto");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const dbPath = path.join(__dirname, "directory.db");
const databasesDir = path.join(__dirname, "databases");
const filesDir = path.join(__dirname, "files");

let db;

function toSafeName(name) {
    return String(name || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "") || "untitled";
}

function createRandomId() {
    return crypto.randomInt(100000000, 999999999);
}

async function databaseExists() {
    try {
        await fs.access(dbPath);
        return true;
    } catch {
        return false;
    }
}

async function initializeDirectory() {
    if (db) return db;

    await fs.mkdir(databasesDir, { recursive: true });
    await fs.mkdir(filesDir, { recursive: true });

    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.exec(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS directory_lists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS databases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            list_id INTEGER,
            directory_id INTEGER,
            parent_id INTEGER,
            name TEXT NOT NULL,
            file_path TEXT NOT NULL UNIQUE,
            sort_order INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (list_id) REFERENCES directory_lists(id) ON DELETE CASCADE,
            FOREIGN KEY (directory_id) REFERENCES directory_folders(id) ON DELETE SET NULL,
            FOREIGN KEY (parent_id) REFERENCES databases(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS directory_folders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            list_id INTEGER NOT NULL,
            parent_id INTEGER,
            name TEXT NOT NULL,
            sort_order INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (list_id) REFERENCES directory_lists(id) ON DELETE CASCADE,
            FOREIGN KEY (parent_id) REFERENCES directory_folders(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_directory_folders_list_id
        ON directory_folders(list_id);

        CREATE INDEX IF NOT EXISTS idx_directory_folders_parent_id
        ON directory_folders(parent_id);

        CREATE INDEX IF NOT EXISTS idx_databases_list_id
        ON databases(list_id);

        CREATE INDEX IF NOT EXISTS idx_databases_parent_id
        ON databases(parent_id);

        CREATE TABLE IF NOT EXISTS related_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            list_id INTEGER NOT NULL,
            source_type TEXT NOT NULL,
            source_database_id INTEGER,
            source_table_name TEXT,
            source_record_id INTEGER,
            target_type TEXT NOT NULL,
            target_database_id INTEGER,
            target_table_name TEXT,
            target_record_id INTEGER,
            label TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (list_id) REFERENCES directory_lists(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_related_items_source
        ON related_items(list_id, source_type, source_database_id, source_table_name, source_record_id);
    `);

    await ensureColumn(db, "databases", "list_id", "INTEGER");
    await ensureColumn(db, "databases", "directory_id", "INTEGER");
    await db.run(
        `INSERT OR IGNORE INTO directory_lists (name) VALUES (?)`,
        "default"
    );

    const defaultList = await getDirectoryListByName("default");
    await db.run(
        `UPDATE databases SET list_id = ? WHERE list_id IS NULL`,
        defaultList.id
    );

    return db;
}

async function ensureColumn(database, tableName, columnName, definition) {
    const columns = await database.all(`PRAGMA table_info(${tableName})`);
    const exists = columns.some(column => column.name === columnName);

    if (!exists) {
        await database.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
    }
}

async function removeDirectory() {
    if (db) {
        await db.close();
        db = null;
    }

    try {
        await fs.rm(databasesDir, { recursive: true, force: true });
        await fs.rm(filesDir, { recursive: true, force: true });
        await fs.unlink(dbPath);
    } catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }
    }
}

async function getDirectoryListByName(name) {
    const directory = db || await initializeDirectory();

    return directory.get(
        `SELECT id, name FROM directory_lists WHERE name = ?`,
        name
    );
}

async function listDirectoryLists() {
    const directory = await initializeDirectory();

    return directory.all(`
        SELECT id, name
        FROM directory_lists
        ORDER BY name = 'default' DESC, name
    `);
}

async function createDirectoryList({ name }) {
    const directory = await initializeDirectory();
    const cleanName = String(name || "").trim();

    if (!cleanName) {
        throw new Error("Directory list name is required");
    }

    const id = createRandomId();

    await directory.run(
        `INSERT INTO directory_lists (id, name) VALUES (?, ?)`,
        id,
        cleanName
    );

    return { id, name: cleanName };
}

async function listDirectoryFolders({ listId = null } = {}) {
    const directory = await initializeDirectory();
    const list = await getDirectoryList(listId);

    if (!list) {
        throw new Error("Directory list not found");
    }

    return directory.all(
        `
        SELECT
            id,
            list_id AS listId,
            parent_id AS parentId,
            name,
            sort_order AS sortOrder
        FROM directory_folders
        WHERE list_id = ?
        ORDER BY parent_id IS NOT NULL, parent_id, sort_order, name
        `,
        list.id
    );
}

async function createDirectoryFolder({ name, listId = null, parentId = null }) {
    const directory = await initializeDirectory();
    const list = await getDirectoryList(listId);
    const cleanName = String(name || "").trim();

    if (!list) {
        throw new Error("Directory list not found");
    }

    if (!cleanName) {
        throw new Error("Folder name is required");
    }

    if (parentId !== null) {
        const parent = await getDirectoryFolder(parentId);

        if (!parent || parent.listId !== list.id) {
            throw new Error("Parent folder not found in selected list");
        }
    }

    const id = createRandomId();

    await directory.run(
        `
        INSERT INTO directory_folders (id, list_id, parent_id, name)
        VALUES (?, ?, ?, ?)
        `,
        id,
        list.id,
        parentId,
        cleanName
    );

    return { id, listId: list.id, parentId, name: cleanName };
}

async function getDirectoryFolder(folderId) {
    const directory = await initializeDirectory();

    return directory.get(
        `
        SELECT id, list_id AS listId, parent_id AS parentId, name
        FROM directory_folders
        WHERE id = ?
        `,
        folderId
    );
}

async function isFolderDescendant({ possibleParentId, folderId }) {
    let current = possibleParentId;

    while (current !== null && current !== undefined) {
        if (current === folderId) return true;

        const row = await getDirectoryFolder(current);
        current = row?.parentId;
    }

    return false;
}

async function moveDirectoryFolder({ folderId, newParentId = null, listId = null }) {
    const directory = await initializeDirectory();
    const folder = await getDirectoryFolder(folderId);

    if (!folder) {
        throw new Error("Folder not found");
    }

    const targetList = listId ? await getDirectoryList(listId) : { id: folder.listId };

    if (!targetList) {
        throw new Error("Target directory list not found");
    }

    if (folderId === newParentId) {
        throw new Error("A folder cannot be its own parent");
    }

    if (newParentId !== null) {
        const parent = await getDirectoryFolder(newParentId);

        if (!parent || parent.listId !== targetList.id) {
            throw new Error("New parent folder not found in target list");
        }

        const wouldCreateCycle = await isFolderDescendant({
            possibleParentId: newParentId,
            folderId
        });

        if (wouldCreateCycle) {
            throw new Error("Cannot move a folder under one of its children");
        }
    }

    const folderIds = await collectFolderAndDescendants(folderId);

    await directory.run(
        `
        UPDATE directory_folders
        SET parent_id = ?, list_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        newParentId,
        targetList.id,
        folderId
    );

    for (const id of folderIds) {
        await directory.run(
            `UPDATE directory_folders SET list_id = ? WHERE id = ?`,
            targetList.id,
            id
        );
        await directory.run(
            `UPDATE databases SET list_id = ? WHERE directory_id = ?`,
            targetList.id,
            id
        );

        const folderDatabases = await directory.all(
            `SELECT id FROM databases WHERE directory_id = ? AND parent_id IS NULL`,
            id
        );

        for (const database of folderDatabases) {
            const branchIds = await collectDatabaseBranchIds(database.id);
            await directory.run(
                `
                UPDATE databases
                SET list_id = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id IN (${branchIds.map(() => "?").join(",")})
                `,
                targetList.id,
                ...branchIds
            );
        }
    }

    return { folderId, parentId: newParentId, listId: targetList.id };
}

async function collectFolderAndDescendants(folderId) {
    const directory = await initializeDirectory();
    const rows = await directory.all(`
        WITH RECURSIVE descendants AS (
            SELECT id
            FROM directory_folders
            WHERE id = ?

            UNION ALL

            SELECT directory_folders.id
            FROM directory_folders
            INNER JOIN descendants ON directory_folders.parent_id = descendants.id
        )
        SELECT id FROM descendants
    `, folderId);

    return rows.map(row => row.id);
}

async function getDirectoryList(listId) {
    const directory = await initializeDirectory();

    if (listId) {
        return directory.get(
            `SELECT id, name FROM directory_lists WHERE id = ?`,
            listId
        );
    }

    return getDirectoryListByName("default");
}

async function listDatabases({ listId } = {}) {
    const directory = await initializeDirectory();
    const list = await getDirectoryList(listId);

    if (!list) {
        throw new Error("Directory list not found");
    }

    return directory.all(
        `
        SELECT
            id,
            list_id AS listId,
            directory_id AS directoryId,
            parent_id AS parentId,
            name,
            file_path AS filePath,
            sort_order AS sortOrder
        FROM databases
        WHERE list_id = ?
        ORDER BY parent_id IS NOT NULL, parent_id, sort_order, name
        `,
        list.id
    );
}

async function getDatabaseNode(databaseId) {
    const directory = await initializeDirectory();

    return directory.get(
        `
        SELECT
            id,
            list_id AS listId,
            directory_id AS directoryId,
            parent_id AS parentId,
            name,
            file_path AS filePath
        FROM databases
        WHERE id = ?
        `,
        databaseId
    );
}

async function openUserDatabase(databaseId) {
    const node = await getDatabaseNode(databaseId);

    if (!node) {
        throw new Error("Database not found");
    }

    const userDb = await open({
        filename: node.filePath,
        driver: sqlite3.Database
    });

    await ensureUserDatabaseSchema(userDb);

    return userDb;
}

async function ensureUserDatabaseSchema(userDb) {
    await userDb.exec(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS app_tables (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS app_table_fields (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            table_name TEXT NOT NULL,
            name TEXT NOT NULL,
            field_type TEXT NOT NULL DEFAULT 'text',
            sort_order INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(table_name, name)
        );
    `);
}

async function createDatabase({ name, parentId = null, listId = null, directoryId = null }) {
    const directory = await initializeDirectory();
    const list = await getDirectoryList(listId);

    if (!list) {
        throw new Error("Directory list not found");
    }

    const cleanName = String(name || "").trim();

    if (!cleanName) {
        throw new Error("Database name is required");
    }

    if (parentId !== null) {
        const parent = await getDatabaseNode(parentId);

        if (!parent || parent.listId !== list.id) {
            throw new Error("Parent database not found in selected list");
        }
    }

    if (directoryId !== null) {
        const folder = await getDirectoryFolder(directoryId);

        if (!folder || folder.listId !== list.id) {
            throw new Error("Directory folder not found in selected list");
        }
    }

    const safeName = toSafeName(cleanName);
    const filePath = path.join(databasesDir, `${Date.now()}_${safeName}.db`);
    const userDb = await open({
        filename: filePath,
        driver: sqlite3.Database
    });

    await ensureUserDatabaseSchema(userDb);
    await userDb.close();

    const id = createRandomId();

    await directory.run(
        `
        INSERT INTO databases (id, list_id, directory_id, parent_id, name, file_path)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        id,
        list.id,
        directoryId,
        parentId,
        cleanName,
        filePath
    );

    return {
        id,
        listId: list.id,
        directoryId,
        parentId,
        name: cleanName,
        filePath
    };
}

async function isDescendant({ possibleParentId, databaseId }) {
    let current = possibleParentId;

    while (current !== null && current !== undefined) {
        if (current === databaseId) return true;

        const row = await getDatabaseNode(current);
        current = row?.parentId;
    }

    return false;
}

async function moveDatabase({ databaseId, newParentId = null, listId = null, directoryId = null }) {
    const directory = await initializeDirectory();
    const node = await getDatabaseNode(databaseId);

    if (!node) {
        throw new Error("Database not found");
    }

    const targetList = listId ? await getDirectoryList(listId) : { id: node.listId };

    if (!targetList) {
        throw new Error("Target directory list not found");
    }

    if (databaseId === newParentId) {
        throw new Error("A database cannot be its own parent");
    }

    if (newParentId !== null) {
        const parent = await getDatabaseNode(newParentId);

        if (!parent || parent.listId !== targetList.id) {
            throw new Error("New parent not found in target list");
        }

        const wouldCreateCycle = await isDescendant({
            possibleParentId: newParentId,
            databaseId
        });

        if (wouldCreateCycle) {
            throw new Error("Cannot move a database under one of its children");
        }
    }

    if (directoryId !== null) {
        const folder = await getDirectoryFolder(directoryId);

        if (!folder || folder.listId !== targetList.id) {
            throw new Error("Target folder not found in target list");
        }
    }

    const branchIds = await collectDatabaseBranchIds(databaseId);

    await directory.run(
        `
        UPDATE databases
        SET parent_id = ?, directory_id = ?, list_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        newParentId,
        directoryId,
        targetList.id,
        databaseId
    );

    await directory.run(
        `
        UPDATE databases
        SET list_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id IN (${branchIds.map(() => "?").join(",")})
        `,
        targetList.id,
        ...branchIds
    );

    return { databaseId, parentId: newParentId, directoryId, listId: targetList.id };
}

async function collectDatabaseBranchIds(databaseId) {
    const directory = await initializeDirectory();
    const rows = await directory.all(`
        WITH RECURSIVE descendants AS (
            SELECT id
            FROM databases
            WHERE id = ?

            UNION ALL

            SELECT databases.id
            FROM databases
            INNER JOIN descendants ON databases.parent_id = descendants.id
        )
        SELECT id FROM descendants
    `, databaseId);

    return rows.map(row => row.id);
}

async function deleteDatabase({ databaseId }) {
    const directory = await initializeDirectory();
    const nodes = await collectDatabaseAndDescendants(databaseId);

    await directory.run(`DELETE FROM databases WHERE id = ?`, databaseId);

    for (const node of nodes) {
        await fs.unlink(node.filePath).catch(error => {
            if (error.code !== "ENOENT") throw error;
        });
    }

    return { deleted: true, count: nodes.length };
}

async function collectDatabaseAndDescendants(databaseId) {
    const directory = await initializeDirectory();
    const nodes = await directory.all(`
        WITH RECURSIVE descendants AS (
            SELECT id, file_path AS filePath
            FROM databases
            WHERE id = ?

            UNION ALL

            SELECT databases.id, databases.file_path AS filePath
            FROM databases
            INNER JOIN descendants ON databases.parent_id = descendants.id
        )
        SELECT id, filePath FROM descendants
    `, databaseId);

    return nodes;
}

async function listTables({ databaseId }) {
    const userDb = await openUserDatabase(databaseId);

    try {
        const tables = await userDb.all(`
            SELECT id, name
            FROM app_tables
            ORDER BY name
        `);

        for (const table of tables) {
            const safeTable = toSafeName(table.name);
            const row = await userDb.get(`SELECT COUNT(*) AS count FROM "${safeTable}"`);
            table.recordCount = row?.count || 0;
            table.fields = await listTableFieldsFromDb(userDb, table.name);
        }

        return tables;
    } finally {
        await userDb.close();
    }
}

async function createTable({ databaseId, tableName, fields = [] }) {
    const safeTable = toSafeName(tableName);
    const userDb = await openUserDatabase(databaseId);

    try {
        await userDb.exec(`
            CREATE TABLE IF NOT EXISTS "${safeTable}" (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                data TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const tableRow = await userDb.get(
            `SELECT id FROM app_tables WHERE name = ?`,
            safeTable
        );

        if (!tableRow) {
            await userDb.run(
                `INSERT INTO app_tables (id, name) VALUES (?, ?)`,
                createRandomId(),
                safeTable
            );
        }

        await replaceTableFieldsInDb(userDb, safeTable, fields);
    } finally {
        await userDb.close();
    }

    return { databaseId, tableName: safeTable, fields };
}

async function listTableFields({ databaseId, tableName }) {
    const safeTable = toSafeName(tableName);
    const userDb = await openUserDatabase(databaseId);

    try {
        await assertTableExists(userDb, safeTable);
        return listTableFieldsFromDb(userDb, safeTable);
    } finally {
        await userDb.close();
    }
}

async function updateTableFields({ databaseId, tableName, fields = [] }) {
    const safeTable = toSafeName(tableName);
    const userDb = await openUserDatabase(databaseId);

    try {
        await assertTableExists(userDb, safeTable);
        await replaceTableFieldsInDb(userDb, safeTable, fields);
        return { databaseId, tableName: safeTable, fields: await listTableFieldsFromDb(userDb, safeTable) };
    } finally {
        await userDb.close();
    }
}

async function listTableFieldsFromDb(userDb, tableName) {
    return userDb.all(
        `
        SELECT id, name, field_type AS fieldType, sort_order AS sortOrder
        FROM app_table_fields
        WHERE table_name = ?
        ORDER BY sort_order, name
        `,
        tableName
    );
}

async function replaceTableFieldsInDb(userDb, tableName, fields = []) {
    const normalized = normalizeFields(fields);

    if (normalized.length === 0) return;

    await userDb.run(`DELETE FROM app_table_fields WHERE table_name = ?`, tableName);

    for (const field of normalized) {
        await userDb.run(
            `
            INSERT INTO app_table_fields (id, table_name, name, field_type, sort_order)
            VALUES (?, ?, ?, ?, ?)
            `,
            createRandomId(),
            tableName,
            field.name,
            field.fieldType,
            field.sortOrder
        );
    }
}

function normalizeFields(fields) {
    if (typeof fields === "string") {
        fields = fields
            .split(",")
            .map(name => ({ name: name.trim(), fieldType: "text" }))
            .filter(field => field.name);
    }

    if (!Array.isArray(fields)) return [];

    return fields
        .map((field, index) => {
            if (typeof field === "string") {
                return {
                    name: toSafeName(field),
                    fieldType: "text",
                    sortOrder: index
                };
            }

            return {
                name: toSafeName(field.name),
                fieldType: field.fieldType || field.type || "text",
                sortOrder: Number(field.sortOrder ?? index)
            };
        })
        .filter(field => field.name);
}

async function listRecords({ databaseId, tableName }) {
    const safeTable = toSafeName(tableName);
    const userDb = await openUserDatabase(databaseId);

    try {
        await assertTableExists(userDb, safeTable);
        const records = await userDb.all(`
            SELECT id, data, created_at AS createdAt, updated_at AS updatedAt
            FROM "${safeTable}"
            ORDER BY id
        `);

        return records.map(record => ({
            ...record,
            data: JSON.parse(record.data || "{}")
        }));
    } finally {
        await userDb.close();
    }
}

async function createRecord({ databaseId, tableName, data = {} }) {
    const safeTable = toSafeName(tableName);
    const userDb = await openUserDatabase(databaseId);

    try {
        await assertTableExists(userDb, safeTable);
        const id = createRandomId();

        await userDb.run(
            `INSERT INTO "${safeTable}" (id, data) VALUES (?, ?)`,
            id,
            JSON.stringify(data)
        );

        return { id, databaseId, tableName: safeTable, data };
    } finally {
        await userDb.close();
    }
}

async function getRecord({ databaseId, tableName, recordId }) {
    const safeTable = toSafeName(tableName);
    const userDb = await openUserDatabase(databaseId);

    try {
        await assertTableExists(userDb, safeTable);
        const record = await userDb.get(
            `
            SELECT id, data, created_at AS createdAt, updated_at AS updatedAt
            FROM "${safeTable}"
            WHERE id = ?
            `,
            recordId
        );

        if (!record) return null;

        return {
            ...record,
            data: JSON.parse(record.data || "{}")
        };
    } finally {
        await userDb.close();
    }
}

async function createFileRecord({ databaseId, tableName, fileName, mimeType, contentBase64 }) {
    const cleanFileName = path.basename(fileName || "attachment");
    const extension = path.extname(cleanFileName).toLowerCase();
    const allowed = [".txt", ".png", ".jpg", ".jpeg", ".gif", ".webp"];

    if (!allowed.includes(extension)) {
        throw new Error("Only .txt files and images are supported");
    }

    const fileId = `${Date.now()}_${toSafeName(path.basename(cleanFileName, extension))}${extension}`;
    const filePath = path.join(filesDir, fileId);
    const buffer = Buffer.from(contentBase64 || "", "base64");

    await fs.writeFile(filePath, buffer);

    const recordType = mimeType?.startsWith("image/") ? "image" : "file";
    const data = {
        type: recordType,
        title: cleanFileName,
        file: {
            id: fileId,
            name: cleanFileName,
            mimeType: mimeType || "application/octet-stream",
            path: filePath
        }
    };

    return createRecord({ databaseId, tableName, data });
}

async function readRecordFile({ databaseId, tableName, recordId }) {
    const record = await getRecord({ databaseId, tableName, recordId });

    if (!record?.data?.file?.path) {
        throw new Error("Record does not contain a file");
    }

    const content = await fs.readFile(record.data.file.path);

    return {
        record,
        fileName: record.data.file.name,
        mimeType: record.data.file.mimeType,
        contentBase64: content.toString("base64")
    };
}

async function updateRecord({ databaseId, tableName, recordId, data = {} }) {
    const safeTable = toSafeName(tableName);
    const userDb = await openUserDatabase(databaseId);

    try {
        await assertTableExists(userDb, safeTable);
        await userDb.run(
            `
            UPDATE "${safeTable}"
            SET data = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            `,
            JSON.stringify(data),
            recordId
        );

        return { databaseId, tableName: safeTable, recordId, data };
    } finally {
        await userDb.close();
    }
}

async function deleteRecord({ databaseId, tableName, recordId }) {
    const safeTable = toSafeName(tableName);
    const userDb = await openUserDatabase(databaseId);

    try {
        await assertTableExists(userDb, safeTable);
        await userDb.run(`DELETE FROM "${safeTable}" WHERE id = ?`, recordId);
    } finally {
        await userDb.close();
    }

    return { deleted: true, databaseId, tableName: safeTable, recordId };
}

async function moveRecordToTable({ databaseId, fromTable, toTable, recordId }) {
    const safeFrom = toSafeName(fromTable);
    const safeTo = toSafeName(toTable);
    const userDb = await openUserDatabase(databaseId);

    try {
        await assertTableExists(userDb, safeFrom);
        await assertTableExists(userDb, safeTo);

        const record = await userDb.get(
            `SELECT data FROM "${safeFrom}" WHERE id = ?`,
            recordId
        );

        if (!record) {
            throw new Error("Record not found");
        }

        await userDb.exec("BEGIN");
        const newRecordId = createRandomId();
        await userDb.run(
            `INSERT INTO "${safeTo}" (id, data) VALUES (?, ?)`,
            newRecordId,
            record.data
        );
        await userDb.run(`DELETE FROM "${safeFrom}" WHERE id = ?`, recordId);
        await userDb.exec("COMMIT");

        return { oldRecordId: recordId, newRecordId };
    } catch (error) {
        await userDb.exec("ROLLBACK").catch(() => {});
        throw error;
    } finally {
        await userDb.close();
    }
}

async function moveRecordToDatabase({
    fromDatabaseId,
    fromTable,
    toDatabaseId,
    toTable,
    recordId
}) {
    const safeFrom = toSafeName(fromTable);
    const safeTo = toSafeName(toTable);
    const fromDb = await openUserDatabase(fromDatabaseId);
    const toDb = await openUserDatabase(toDatabaseId);

    try {
        await assertTableExists(fromDb, safeFrom);
        await assertTableExists(toDb, safeTo);

        const record = await fromDb.get(
            `SELECT data FROM "${safeFrom}" WHERE id = ?`,
            recordId
        );

        if (!record) {
            throw new Error("Record not found");
        }

        const newRecordId = createRandomId();
        await toDb.run(
            `INSERT INTO "${safeTo}" (id, data) VALUES (?, ?)`,
            newRecordId,
            record.data
        );
        await fromDb.run(`DELETE FROM "${safeFrom}" WHERE id = ?`, recordId);

        return { oldRecordId: recordId, newRecordId };
    } finally {
        await fromDb.close();
        await toDb.close();
    }
}

async function assertTableExists(userDb, tableName) {
    const row = await userDb.get(
        `SELECT name FROM app_tables WHERE name = ?`,
        tableName
    );

    if (!row) {
        throw new Error("Table not found");
    }
}

async function createRelatedItem({
    listId = null,
    source,
    target,
    label = null
}) {
    const directory = await initializeDirectory();
    const list = await getDirectoryList(listId);

    if (!list) {
        throw new Error("Directory list not found");
    }

    const id = createRandomId();

    await directory.run(
        `
        INSERT INTO related_items (
            id,
            list_id,
            source_type,
            source_database_id,
            source_table_name,
            source_record_id,
            target_type,
            target_database_id,
            target_table_name,
            target_record_id,
            label
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        id,
        list.id,
        source.type,
        source.databaseId || null,
        source.tableName || null,
        source.recordId || null,
        target.type,
        target.databaseId || null,
        target.tableName || null,
        target.recordId || null,
        label
    );

    return { id };
}

async function listRelatedItems({ listId = null } = {}) {
    const directory = await initializeDirectory();
    const list = await getDirectoryList(listId);

    if (!list) {
        throw new Error("Directory list not found");
    }

    return directory.all(
        `
        SELECT
            id,
            source_type AS sourceType,
            source_database_id AS sourceDatabaseId,
            source_table_name AS sourceTableName,
            source_record_id AS sourceRecordId,
            target_type AS targetType,
            target_database_id AS targetDatabaseId,
            target_table_name AS targetTableName,
            target_record_id AS targetRecordId,
            label
        FROM related_items
        WHERE list_id = ?
        ORDER BY id
        `,
        list.id
    );
}

module.exports = {
    databaseExists,
    initializeDirectory,
    removeDirectory,
    listDirectoryLists,
    createDirectoryList,
    listDirectoryFolders,
    createDirectoryFolder,
    moveDirectoryFolder,
    listDatabases,
    createDatabase,
    moveDatabase,
    deleteDatabase,
    listTables,
    createTable,
    listTableFields,
    updateTableFields,
    listRecords,
    createRecord,
    getRecord,
    createFileRecord,
    readRecordFile,
    updateRecord,
    deleteRecord,
    moveRecordToTable,
    moveRecordToDatabase,
    createRelatedItem,
    listRelatedItems
};
