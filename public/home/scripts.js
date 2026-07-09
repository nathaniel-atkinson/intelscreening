import {globalConsts} from "/api/global/scripts";

const {body, main_M, main_L, main_R} = globalConsts;

const mainMenu = main_L;
const buttons = mainMenu.querySelectorAll(".button");

let directoryLists = [];
let currentListId = null;
let selectedDatabaseId = null;
let selectedTableName = null;
let selectedRecordId = null;
let directoryDatabases = [];
let directoryFolders = [];
let directoryTables = new Map();
let relatedItems = [];
let expandedItems = new Set();
let expandAll = false;

buttons.forEach(button => {
    const action = button.dataset.actionTarget;

    button.addEventListener("click", async (e) => {
        e.stopPropagation();
        await createMenu(action, e, button);
    })
})

document.addEventListener("click", (e) => {
    const clickedMainMenu = e.target.closest("main .left .button");
    const clickedFloatingMenu = e.target.closest(".temp");

    if (!clickedMainMenu && !clickedFloatingMenu) {
        closeLeftMenus();
    }
});

await refreshDirectoryView();

async function createMenu(action, e, button) {
    let menu = document.querySelector(`#${action}`);

    closeOtherMenus(action);

    const rect = button.getBoundingClientRect();
    const {top, right} = rect;

    if (!menu) {
        menu = document.createElement("div");
        menu.classList.add("temp");
        menu.id = action;
        menu.style.position = "fixed";
        menu.style.left = `${right + 10}px`
        menu.style.top = `${top}px`
        menu.style.zIndex = 100;
        menu.style.backgroundColor = "var(--bg)";
        menu.style.color = "var(--color)";
        menu.style.border = "3px solid var(--border)";
        menu.style.width = "fit-content";
        menu.style.height = "fit-content";
        menu.style.padding = "10px";

        await populateMenu(menu, action);
        body.appendChild(menu);
        button.classList.add("active");

    } else {
        menu.remove();
        button.classList.remove("active");
    }
}

function closeOtherMenus(action) {
    buttons.forEach(button => {
        const menuId = button.dataset.actionTarget;

        if (menuId !== action) {
            document.querySelector(`#${menuId}`)?.remove();
            button.classList.remove("active");
        }
    })
}

async function populateMenu(menu, action) {
    const directory = await getJson('/api/database/test');

    if (action === "createMenu") {
        if (!directory.exists) {
            menu.innerHTML =`
                <span class="underlined bold">OPTIONS</span>
                <p id="createDirectory">Create Directory()</p>
            `;
            menu.querySelector("#createDirectory")?.addEventListener("click", () => confirmDirectoryAction("createDirectory"));
        } else {
            menu.innerHTML =`
                <span class="underlined bold">OPTIONS</span>
                <p id="createDirectoryList">Directory List</p>
                <p id="createDirectoryFolder">Sub Directory</p>
                <p id="createDatabase">Database</p>
                <p id="createTable">Database Table</p>
                <p id="createRecord">Database Table Record</p>
                <p id="createFileRecord">Text/Image Record</p>
                <p id="editTableColumns">Edit Table Columns</p>
                <p id="linkRelated">Related Link</p>
            `;
            menu.querySelector("#createDirectoryList")?.addEventListener("click", createDirectoryList);
            menu.querySelector("#createDirectoryFolder")?.addEventListener("click", createDirectoryFolder);
            menu.querySelector("#createDatabase")?.addEventListener("click", createDatabase);
            menu.querySelector("#createTable")?.addEventListener("click", createTable);
            menu.querySelector("#createRecord")?.addEventListener("click", createRecord);
            menu.querySelector("#createFileRecord")?.addEventListener("click", createFileRecord);
            menu.querySelector("#editTableColumns")?.addEventListener("click", editTableColumns);
            menu.querySelector("#linkRelated")?.addEventListener("click", createRelatedLinkFromSelection);
        }
    }

    if (action === "openMenu") {
        menu.innerHTML =`
            <span class="underlined bold">OPTIONS</span>
            <p id="openDirectory">Open Directory</p>
            <p id="openSelectedTable">Open Selected Table</p>
            <p id="toggleExpandAll">${expandAll ? "Collapse All" : "Expand All"}</p>
        `;
        menu.querySelector("#openDirectory")?.addEventListener("click", refreshDirectoryView);
        menu.querySelector("#openSelectedTable")?.addEventListener("click", openSelectedTable);
        menu.querySelector("#toggleExpandAll")?.addEventListener("click", async () => {
            expandAll = !expandAll;
            closeLeftMenus();
            await renderDirectoryTree();
        });
    }

    if (action === "moveMenu") {
        menu.innerHTML =`
            <span class="underlined bold">OPTIONS</span>
            <p id="moveDirectoryFolder">Move Sub Directory</p>
            <p id="moveDatabase">Move Database</p>
            <p id="moveRecord">Move Selected Record</p>
        `;
        menu.querySelector("#moveDirectoryFolder")?.addEventListener("click", moveDirectoryFolder);
        menu.querySelector("#moveDatabase")?.addEventListener("click", moveDatabase);
        menu.querySelector("#moveRecord")?.addEventListener("click", moveSelectedRecord);
    }

    if (action === "deleteMenu") {
        menu.innerHTML =`
            <span class="underlined bold">OPTIONS</span>
            <p id="deleteDirectory">Delete Directory()</p>
            <p id="deleteDatabase">Delete Selected Database</p>
            <p id="deleteRecord">Delete Selected Record</p>
        `;
        menu.querySelector("#deleteDirectory")?.addEventListener("click", () => confirmDirectoryAction("deleteDirectory"));
        menu.querySelector("#deleteDatabase")?.addEventListener("click", deleteSelectedDatabase);
        menu.querySelector("#deleteRecord")?.addEventListener("click", deleteSelectedRecord);
    }

    menu.querySelectorAll("p").forEach(i => {i.classList.add("button");})
}

async function confirmDirectoryAction(action) {
    const confirmed = await openModal({
        title: "ALERT",
        message: action === "createDirectory"
            ? "Create directory.db and the default list?"
            : "Delete directory.db, generated databases, and stored files?",
        confirmText: "Confirm"
    });

    if (!confirmed) return;

    if (action === "createDirectory") {
        await createDirectory();
    }

    if (action === "deleteDirectory") {
        await deleteDirectory();
    }
}

async function refreshDirectoryView() {
    const directory = await getJson('/api/database/test');

    main_M.innerHTML = "";
    main_R.innerHTML = "";

    if (!directory.exists) {
        appendLine(main_M, "No directory.db found. Use CREATE > Create Directory().");
        return;
    }

    const response = await getJson('/api/directory/lists');
    directoryLists = response.lists || [];

    if (directoryLists.length === 0) {
        appendLine(main_M, "No directory lists found.");
        return;
    }

    if (!currentListId) {
        const defaultList = directoryLists.find(list => list.name === "default") || directoryLists[0];
        currentListId = defaultList.id;
    }

    if (directoryLists.length > 1) {
        renderDirectoryListOptions();
        return;
    }

    await openDirectoryList(currentListId);
}

function renderDirectoryListOptions() {
    main_M.innerHTML = "";
    appendLine(main_M, "Directory Lists").classList.add("bold", "underlined");

    directoryLists.forEach(list => {
        const line = appendLine(main_M, list.name);
        line.classList.add("button");
        line.addEventListener("click", async () => {
            currentListId = list.id;
            await openDirectoryList(list.id);
        });
    })
}

async function openDirectoryList(listId) {
    currentListId = listId;
    main_R.innerHTML = "";
    await loadDirectoryData();
    await renderDirectoryTree();
}

async function loadDirectoryData() {
    const folderResponse = await getJson(`/api/directory/folders?listId=${encodeURIComponent(currentListId)}`);
    directoryFolders = folderResponse.folders || [];

    const response = await getJson(`/api/database/list?listId=${encodeURIComponent(currentListId)}`);
    directoryDatabases = response.databases || [];
    directoryTables = new Map();

    for (const database of directoryDatabases) {
        const tableResponse = await getJson(`/api/database/tables?databaseId=${database.id}`);
        directoryTables.set(database.id, tableResponse.tables || []);
    }

    const relatedResponse = await getJson(`/api/related/list?listId=${encodeURIComponent(currentListId)}`);
    relatedItems = relatedResponse.related || [];
}

async function renderDirectoryTree() {
    main_M.innerHTML = "";

    const list = directoryLists.find(item => item.id === currentListId);
    const header = appendLine(main_M, `${list ? list.name : "default"} ${expandAll ? "(expanded)" : "(collapsed)"}`);
    header.classList.add("bold", "underlined");

    if (directoryDatabases.length === 0) {
        appendLine(main_M, "No databases in this list.");
        return;
    }

    const foldersByParent = new Map();
    const rootDatabases = directoryDatabases.filter(database => !database.parentId);

    directoryFolders.forEach(folder => {
        const parentKey = folder.parentId || "root";
        const children = foldersByParent.get(parentKey) || [];
        children.push(folder);
        foldersByParent.set(parentKey, children);
    });

    renderFolderBranch(foldersByParent, null, 0);

    const childrenByParent = new Map();
    directoryDatabases.forEach(database => {
        const parentKey = database.parentId || "root";
        const children = childrenByParent.get(parentKey) || [];
        children.push(database);
        childrenByParent.set(parentKey, children);
    });

    renderDatabaseBranch(childrenByParent, null, 0, rootDatabases.filter(database => !database.directoryId));
}

function renderFolderBranch(foldersByParent, parentId, depth) {
    const folders = foldersByParent.get(parentId || "root") || [];

    folders.forEach(folder => {
        renderFolderLine(folder, depth);

        const key = itemKey({ type: "folder", folderId: folder.id });
        if (isExpanded(key)) {
            renderFolderBranch(foldersByParent, folder.id, depth + 1);

            const folderDatabases = directoryDatabases.filter(database => !database.parentId && database.directoryId === folder.id);
            const childrenByParent = new Map();
            directoryDatabases.forEach(database => {
                const parentKey = database.parentId || "root";
                const children = childrenByParent.get(parentKey) || [];
                children.push(database);
                childrenByParent.set(parentKey, children);
            });
            renderDatabaseBranch(childrenByParent, null, depth + 1, folderDatabases);
        }
    });
}

function renderFolderLine(folder, depth) {
    const key = itemKey({ type: "folder", folderId: folder.id });
    const dependantCount = directFolderDependantCount(folder.id);
    const prefix = isExpanded(key) ? "[-]" : "[+]";
    const line = appendLine(main_M, `${prefix} ${folder.name} (${dependantCount})`, depth);

    line.classList.add("button");
    line.dataset.type = "folder";
    line.dataset.folderId = folder.id;
    line.addEventListener("click", async () => {
        selectedDatabaseId = null;
        selectedTableName = null;
        selectedRecordId = null;
        toggleExpanded(key);
        markSelected(line, main_M);
        await renderDirectoryTree();
    });
}

function renderDatabaseBranch(childrenByParent, parentId, depth, explicitChildren = null) {
    const children = explicitChildren || childrenByParent.get(parentId || "root") || [];

    children.forEach(database => {
        renderDatabaseLine(database, depth);

        const key = itemKey({ type: "database", databaseId: database.id });
        if (isExpanded(key)) {
            renderRelatedAliases({ type: "database", databaseId: database.id }, depth + 1);

            const tables = directoryTables.get(database.id) || [];
            tables.forEach(table => renderTableLine(database, table, depth + 1));

            renderDatabaseBranch(childrenByParent, database.id, depth + 1);
        }
    });
}

function renderDatabaseLine(database, depth) {
    const key = itemKey({ type: "database", databaseId: database.id });
    const dependantCount = directDatabaseDependantCount(database.id);
    const prefix = isExpanded(key) ? "[-]" : "[+]";
    const line = appendLine(main_M, `${prefix} ${database.name} (${dependantCount})`, depth);

    line.classList.add("button");
    line.dataset.type = "database";
    line.dataset.databaseId = database.id;
    line.addEventListener("click", async () => {
        selectedDatabaseId = database.id;
        selectedTableName = null;
        selectedRecordId = null;
        toggleExpanded(key);
        markSelected(line, main_M);
        await renderDirectoryTree();
    });
    line.addEventListener("contextmenu", (e) => openDirectoryContextMenu(e, {
        type: "database",
        databaseId: database.id
    }));
}

function renderTableLine(database, table, depth) {
    const key = itemKey({ type: "table", databaseId: database.id, tableName: table.name });
    const line = appendLine(main_M, `${isExpanded(key) ? "[-]" : "[+]"} ${table.name} (${table.recordCount || 0})`, depth);

    line.classList.add("button");
    line.dataset.type = "table";
    line.dataset.databaseId = database.id;
    line.dataset.tableName = table.name;
    line.addEventListener("click", async () => {
        selectedDatabaseId = database.id;
        selectedTableName = table.name;
        selectedRecordId = null;
        toggleExpanded(key);
        markSelected(line, main_M);
        await openTable(database.id, table.name);
        await renderDirectoryTree();
    });
    line.addEventListener("contextmenu", (e) => openDirectoryContextMenu(e, {
        type: "table",
        databaseId: database.id,
        tableName: table.name
    }));

    if (isExpanded(key)) {
        renderRelatedAliases({
            type: "table",
            databaseId: database.id,
            tableName: table.name
        }, depth + 1);
    }
}

function renderRelatedAliases(source, depth) {
    relatedItems
        .filter(link => sameItem(linkSource(link), source))
        .forEach(link => {
            const target = linkTarget(link);
            const line = appendLine(main_M, `related: ${relatedLabel(link, target)}`, depth);
            line.classList.add("button");
            line.style.color = "blue";
            line.dataset.related = "true";
            line.addEventListener("click", () => selectTarget(target));
            line.addEventListener("contextmenu", (e) => openRelatedContextMenu(e, target));
        });
}

function openDirectoryContextMenu(e, source) {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector("#directoryContextMenu")?.remove();

    const menu = createContextMenu("directoryContextMenu", e);
    menu.innerHTML = `
        <p id="linkRelated">Link Related Item</p>
        ${source.type === "table" ? `<p id="editColumns">Edit Columns</p>` : ""}
    `;
    menu.querySelector("#linkRelated").addEventListener("click", async () => {
        document.querySelector("#directoryContextMenu")?.remove();
        await createRelatedLink(source);
    });
    menu.querySelector("#editColumns")?.addEventListener("click", async () => {
        document.querySelector("#directoryContextMenu")?.remove();
        selectedDatabaseId = source.databaseId;
        selectedTableName = source.tableName;
        await editTableColumns();
    });
    menu.querySelectorAll("p").forEach(i => {i.classList.add("button");})
    body.appendChild(menu);
}

function openRelatedContextMenu(e, target) {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector("#relatedContextMenu")?.remove();

    const menu = createContextMenu("relatedContextMenu", e);
    menu.innerHTML = `
        <p id="travelToItem">Travel To Item In Directory</p>
    `;
    menu.querySelector("#travelToItem").addEventListener("click", async () => {
        document.querySelector("#relatedContextMenu")?.remove();
        await travelToItem(target);
    });
    menu.querySelectorAll("p").forEach(i => {i.classList.add("button");})
    body.appendChild(menu);
}

async function openSelectedTable() {
    if (!selectedDatabaseId || !selectedTableName) {
        await openModal({ title: "ALERT", message: "Select a table first.", confirmText: "OK", hideCancel: true });
        return;
    }

    await openTable(selectedDatabaseId, selectedTableName);
}

async function openTable(databaseId, tableName) {
    const response = await getJson(`/api/database/records?databaseId=${databaseId}&tableName=${encodeURIComponent(tableName)}`);
    const records = response.records || [];

    main_R.innerHTML = "";
    appendLine(main_R, tableName).classList.add("bold", "underlined");

    if (records.length === 0) {
        appendLine(main_R, "No records found.");
        return;
    }

    records.forEach(record => {
        const line = appendLine(main_R, `#${record.id} ${recordSummary(record.data)}`);
        line.classList.add("button");
        line.dataset.recordId = record.id;
        line.addEventListener("click", async () => {
            selectedDatabaseId = databaseId;
            selectedTableName = tableName;
            selectedRecordId = record.id;
            markSelected(line, main_R);

            if (record.data?.type === "file" || record.data?.type === "image") {
                await openRecordItem(databaseId, tableName, record.id);
            }
        });
        line.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            selectedDatabaseId = databaseId;
            selectedTableName = tableName;
            selectedRecordId = record.id;
            markSelected(line, main_R);
            openRecordContextMenu(e);
        });
    });
}

async function openRecordItem(databaseId, tableName, recordId) {
    const response = await getJson(`/api/record/file?databaseId=${databaseId}&tableName=${encodeURIComponent(tableName)}&recordId=${recordId}`);
    const file = response.file;

    if (!file) {
        await openModal({ title: "ALERT", message: "This record does not contain an openable file.", confirmText: "OK", hideCancel: true });
        return;
    }

    main_R.innerHTML = "";
    appendLine(main_R, file.fileName).classList.add("bold", "underlined");

    if (file.mimeType?.startsWith("image/")) {
        const image = document.createElement("img");
        image.src = `data:${file.mimeType};base64,${file.contentBase64}`;
        image.style.maxWidth = "100%";
        image.style.height = "auto";
        main_R.appendChild(image);
    } else {
        const text = document.createElement("pre");
        text.textContent = atob(file.contentBase64);
        text.style.whiteSpace = "pre-wrap";
        main_R.appendChild(text);
    }
}

function openRecordContextMenu(e) {
    document.querySelector("#recordContextMenu")?.remove();

    const menu = createContextMenu("recordContextMenu", e);
    menu.innerHTML = `
        <p id="openRecord">Open Record</p>
        <p id="addRecord">Add Record</p>
        <p id="editRecord">Edit Record</p>
        <p id="linkRelated">Link Related Item</p>
        <p id="moveRecord">Move</p>
        <p id="deleteRecord">Delete</p>
    `;

    menu.querySelector("#openRecord").addEventListener("click", async () => {
        document.querySelector("#recordContextMenu")?.remove();
        await openRecordItem(selectedDatabaseId, selectedTableName, selectedRecordId);
    });
    menu.querySelector("#addRecord").addEventListener("click", createRecord);
    menu.querySelector("#editRecord").addEventListener("click", editSelectedRecord);
    menu.querySelector("#linkRelated").addEventListener("click", async () => {
        document.querySelector("#recordContextMenu")?.remove();
        await createRelatedLink({
            type: "record",
            databaseId: selectedDatabaseId,
            tableName: selectedTableName,
            recordId: selectedRecordId
        });
    });
    menu.querySelector("#moveRecord").addEventListener("click", moveSelectedRecord);
    menu.querySelector("#deleteRecord").addEventListener("click", deleteSelectedRecord);
    menu.querySelectorAll("p").forEach(i => {i.classList.add("button");})

    body.appendChild(menu);
}

document.addEventListener("click", (e) => {
    if (!e.target.closest("#recordContextMenu")) {
        document.querySelector("#recordContextMenu")?.remove();
    }
    if (!e.target.closest("#directoryContextMenu")) {
        document.querySelector("#directoryContextMenu")?.remove();
    }
    if (!e.target.closest("#relatedContextMenu")) {
        document.querySelector("#relatedContextMenu")?.remove();
    }
});

async function createDirectory() {
    const directory = await postJson('/api/database/createdirectory', {});

    if (directory.created) {
        closeLeftMenus();
        await refreshDirectoryView();
    }
}

async function deleteDirectory() {
    const directory = await postJson('/api/database/deleteDirectory', {});

    if (directory.deleted) {
        closeLeftMenus();
        currentListId = null;
        selectedDatabaseId = null;
        selectedTableName = null;
        selectedRecordId = null;
        directoryDatabases = [];
        directoryTables = new Map();
        relatedItems = [];
        expandedItems.clear();
        await refreshDirectoryView();
    }
}

async function createDirectoryList() {
    closeLeftMenus();
    renderMainRForm({
        title: "Create Directory List",
        fields: [{ name: "name", label: "Name" }],
        onSubmit: async (values) => {
            const response = await postJson('/api/directory/lists', { name: values.name });

            if (response.created) {
                currentListId = response.created.id;
                await refreshDirectoryView();
                appendLine(main_R, `Created directory list: ${response.created.name}`);
            }
        }
    });
}

async function createDirectoryFolder() {
    closeLeftMenus();
    renderMainRForm({
        title: "Create Sub Directory",
        fields: [
            { name: "name", label: "Name" },
            { name: "parentId", label: "Parent sub directory id" }
        ],
        onSubmit: async (values) => {
            const response = await postJson('/api/directory/folders', {
                name: values.name,
                parentId: values.parentId ? Number(values.parentId) : null,
                listId: currentListId
            });

            if (response.created) {
                await loadDirectoryData();
                await renderDirectoryTree();
                appendLine(main_R, `Created sub directory: ${response.created.name}`);
            }
        }
    });
}

async function createDatabase() {
    closeLeftMenus();
    renderMainRForm({
        title: "Create Database",
        fields: [
            { name: "name", label: "Name" },
            { name: "parentId", label: "Parent topic/database id", value: selectedDatabaseId || "" },
            { name: "directoryId", label: "Sub directory id" }
        ],
        onSubmit: async (values) => {
            const response = await postJson('/api/database/createdatabase', {
                name: values.name,
                parentId: values.parentId ? Number(values.parentId) : null,
                directoryId: values.directoryId ? Number(values.directoryId) : null,
                listId: currentListId
            });

            if (response.created) {
                selectedDatabaseId = response.created.id;
                selectedTableName = null;
                selectedRecordId = null;
                await loadDirectoryData();
                await renderDirectoryTree();
                appendLine(main_R, `Created database: ${response.created.name}`);
            }
        }
    });
}

async function moveDatabase() {
    closeLeftMenus();
    renderMainRForm({
        title: "Move Database",
        fields: [
            { name: "databaseId", label: "Topic/database id", value: selectedDatabaseId || "" },
            { name: "newParentId", label: "New parent topic/database id" },
            { name: "directoryId", label: "Target sub directory id" },
            { name: "listId", label: "Target directory list id", value: currentListId || "" }
        ],
        onSubmit: async (values) => {
            if (!values.databaseId) return;

            const response = await postJson('/api/database/move', {
                databaseId: Number(values.databaseId),
                newParentId: values.newParentId ? Number(values.newParentId) : null,
                directoryId: values.directoryId ? Number(values.directoryId) : null,
                listId: values.listId ? Number(values.listId) : currentListId
            });

            if (response.moved) {
                currentListId = response.moved.listId;
                await loadDirectoryData();
                await renderDirectoryTree();
                appendLine(main_R, "Moved topic/database and kept its child topics.");
            }
        }
    });
}

async function moveDirectoryFolder() {
    closeLeftMenus();
    renderMainRForm({
        title: "Move Sub Directory",
        fields: [
            { name: "folderId", label: "Sub directory id" },
            { name: "newParentId", label: "New parent sub directory id" },
            { name: "listId", label: "Target directory list id", value: currentListId || "" }
        ],
        onSubmit: async (values) => {
            if (!values.folderId) return;

            const response = await postJson('/api/directory/folders/move', {
                folderId: Number(values.folderId),
                newParentId: values.newParentId ? Number(values.newParentId) : null,
                listId: values.listId ? Number(values.listId) : currentListId
            });

            if (response.moved) {
                currentListId = response.moved.listId;
                await loadDirectoryData();
                await renderDirectoryTree();
                appendLine(main_R, "Moved sub directory and kept its contents.");
            }
        }
    });
}

async function deleteSelectedDatabase() {
    const values = await openModal({
        title: "Delete Database",
        message: "Delete selected database and its nested database files?",
        fields: [{ name: "databaseId", label: "Database id", value: selectedDatabaseId || "" }],
        confirmText: "Delete"
    });
    if (!values?.databaseId) return;

    const response = await postJson('/api/database/delete', { databaseId: Number(values.databaseId) });

    if (response.deleted) {
        selectedDatabaseId = null;
        selectedTableName = null;
        selectedRecordId = null;
        closeLeftMenus();
        await loadDirectoryData();
        await renderDirectoryTree();
    }
}

async function createTable() {
    closeLeftMenus();
    renderMainRForm({
        title: "Create Table",
        fields: [
            { name: "databaseId", label: "Database id", value: selectedDatabaseId || "" },
            { name: "tableName", label: "Table name" },
            { name: "fields", label: "Columns (comma separated)", value: "title, notes, source, status" }
        ],
        onSubmit: async (values) => {
            if (!values.databaseId || !values.tableName) return;

            const response = await postJson('/api/database/createtable', {
                databaseId: Number(values.databaseId),
                tableName: values.tableName,
                fields: values.fields
            });

            if (response.created) {
                selectedDatabaseId = Number(values.databaseId);
                selectedTableName = response.created.tableName;
                selectedRecordId = null;
                await loadDirectoryData();
                await renderDirectoryTree();
                await openTable(selectedDatabaseId, response.created.tableName);
            }
        }
    });
}

async function createRecord() {
    if (!selectedDatabaseId || !selectedTableName) {
        await openModal({ title: "ALERT", message: "Select a table first.", confirmText: "OK", hideCancel: true });
        return;
    }

    closeLeftMenus();
    document.querySelector("#recordContextMenu")?.remove();
    const fieldResponse = await getJson(`/api/database/table-fields?databaseId=${selectedDatabaseId}&tableName=${encodeURIComponent(selectedTableName)}`);
    const tableFields = fieldResponse.fields || [];

    if (tableFields.length > 0) {
        renderMainRForm({
            title: "Create Record",
            message: `${selectedTableName} in database ${selectedDatabaseId}`,
            fields: tableFields.map(field => ({
                name: field.name,
                label: field.name,
                type: field.fieldType === "longtext" ? "textarea" : "text"
            })),
            onSubmit: async (values) => {
                const response = await postJson('/api/record/create', {
                    databaseId: selectedDatabaseId,
                    tableName: selectedTableName,
                    data: values
                });

                if (response.created) {
                    selectedRecordId = response.created.id;
                    await loadDirectoryData();
                    await openTable(selectedDatabaseId, selectedTableName);
                }
            }
        });
        return;
    }

    renderMainRForm({
        title: "Create Record",
        message: `${selectedTableName} in database ${selectedDatabaseId}`,
        fields: [{ name: "json", label: "Record JSON", type: "textarea", value: "{}" }],
        onSubmit: async (values) => {
            const data = parseModalJson(values.json);
            if (!data) return;

            const response = await postJson('/api/record/create', {
                databaseId: selectedDatabaseId,
                tableName: selectedTableName,
                data
            });

            if (response.created) {
                selectedRecordId = response.created.id;
                await loadDirectoryData();
                await openTable(selectedDatabaseId, selectedTableName);
            }
        }
    });
}

async function editTableColumns() {
    if (!selectedDatabaseId || !selectedTableName) {
        await openModal({ title: "ALERT", message: "Select a table first.", confirmText: "OK", hideCancel: true });
        return;
    }

    closeLeftMenus();
    const fieldResponse = await getJson(`/api/database/table-fields?databaseId=${selectedDatabaseId}&tableName=${encodeURIComponent(selectedTableName)}`);
    const fields = fieldResponse.fields || [];
    const value = fields.map(field => `${field.name}:${field.fieldType}`).join(", ");

    renderMainRForm({
        title: "Edit Table Columns",
        message: `${selectedTableName} in database ${selectedDatabaseId}. Use name:type pairs, comma separated.`,
        fields: [{ name: "fields", label: "Columns", type: "textarea", value }],
        submitText: "Save",
        onSubmit: async (values) => {
            const response = await postJson('/api/database/table-fields', {
                databaseId: selectedDatabaseId,
                tableName: selectedTableName,
                fields: parseFieldList(values.fields)
            });

            if (response.updated) {
                await loadDirectoryData();
                await renderDirectoryTree();
                appendLine(main_R, "Updated table columns.");
            }
        }
    });
}

async function createFileRecord() {
    if (!selectedDatabaseId || !selectedTableName) {
        await openModal({ title: "ALERT", message: "Select a table first.", confirmText: "OK", hideCancel: true });
        return;
    }

    closeLeftMenus();
    renderMainRForm({
        title: "Create Text/Image Record",
        message: `${selectedTableName} in database ${selectedDatabaseId}`,
        fields: [{ name: "file", label: "File", type: "file", accept: ".txt,image/*" }],
        onSubmit: async (values) => {
            if (!values.file) return;

            const response = await postJson('/api/record/create-file', {
                databaseId: selectedDatabaseId,
                tableName: selectedTableName,
                fileName: values.file.name,
                mimeType: values.file.type,
                contentBase64: values.file.contentBase64
            });

            if (response.created) {
                selectedRecordId = response.created.id;
                await loadDirectoryData();
                await openTable(selectedDatabaseId, selectedTableName);
            }
        }
    });
}

async function editSelectedRecord() {
    if (!selectedDatabaseId || !selectedTableName || !selectedRecordId) {
        await openModal({ title: "ALERT", message: "Select a record first.", confirmText: "OK", hideCancel: true });
        return;
    }

    const records = await getJson(`/api/database/records?databaseId=${selectedDatabaseId}&tableName=${encodeURIComponent(selectedTableName)}`);
    const record = (records.records || []).find(item => item.id === Number(selectedRecordId));
    const values = await openModal({
        title: "Edit Record",
        fields: [{ name: "json", label: "Record JSON", type: "textarea", value: JSON.stringify(record?.data || {}, null, 2) }]
    });
    if (!values) return;

    const data = parseModalJson(values.json);
    if (!data) return;

    const response = await postJson('/api/record/update', {
        databaseId: selectedDatabaseId,
        tableName: selectedTableName,
        recordId: selectedRecordId,
        data
    });

    if (response.updated) {
        document.querySelector("#recordContextMenu")?.remove();
        await openTable(selectedDatabaseId, selectedTableName);
    }
}

async function moveSelectedRecord() {
    if (!selectedDatabaseId || !selectedTableName || !selectedRecordId) {
        await openModal({ title: "ALERT", message: "Select a record first.", confirmText: "OK", hideCancel: true });
        return;
    }

    const values = await openModal({
        title: "Move Record",
        fields: [
            { name: "targetDatabaseId", label: "Target database id", value: selectedDatabaseId },
            { name: "targetTable", label: "Target table", value: selectedTableName }
        ]
    });
    if (!values?.targetTable) return;

    const targetDatabaseId = values.targetDatabaseId ? Number(values.targetDatabaseId) : selectedDatabaseId;
    const endpoint = targetDatabaseId === selectedDatabaseId
        ? '/api/record/move-table'
        : '/api/record/move-database';
    const requestBody = targetDatabaseId === selectedDatabaseId
        ? {
            databaseId: selectedDatabaseId,
            fromTable: selectedTableName,
            toTable: values.targetTable,
            recordId: selectedRecordId
        }
        : {
            fromDatabaseId: selectedDatabaseId,
            fromTable: selectedTableName,
            toDatabaseId: targetDatabaseId,
            toTable: values.targetTable,
            recordId: selectedRecordId
        };

    const response = await postJson(endpoint, requestBody);

    if (response.moved) {
        document.querySelector("#recordContextMenu")?.remove();
        await loadDirectoryData();
        await openTable(selectedDatabaseId, selectedTableName);
    }
}

async function deleteSelectedRecord() {
    if (!selectedDatabaseId || !selectedTableName || !selectedRecordId) {
        await openModal({ title: "ALERT", message: "Select a record first.", confirmText: "OK", hideCancel: true });
        return;
    }

    const confirmed = await openModal({
        title: "Delete Record",
        message: "Delete selected record?",
        confirmText: "Delete"
    });
    if (!confirmed) return;

    const response = await postJson('/api/record/delete', {
        databaseId: selectedDatabaseId,
        tableName: selectedTableName,
        recordId: selectedRecordId
    });

    if (response.deleted) {
        selectedRecordId = null;
        document.querySelector("#recordContextMenu")?.remove();
        await loadDirectoryData();
        await openTable(selectedDatabaseId, selectedTableName);
    }
}

async function createRelatedLinkFromSelection() {
    const source = currentSelectionItem();

    if (!source) {
        await openModal({ title: "ALERT", message: "Select a database, table, or record first.", confirmText: "OK", hideCancel: true });
        return;
    }

    await createRelatedLink(source);
}

async function createRelatedLink(source) {
    const values = await openModal({
        title: "Create Related Link",
        message: "Target type can be database, table, or record.",
        fields: [
            { name: "targetType", label: "Target type", value: "database" },
            { name: "targetDatabaseId", label: "Target database id" },
            { name: "targetTableName", label: "Target table name" },
            { name: "targetRecordId", label: "Target record id" },
            { name: "label", label: "Label" }
        ]
    });
    if (!values) return;

    const target = {
        type: values.targetType,
        databaseId: values.targetDatabaseId ? Number(values.targetDatabaseId) : null,
        tableName: values.targetTableName || null,
        recordId: values.targetRecordId ? Number(values.targetRecordId) : null
    };

    const response = await postJson('/api/related/create', {
        listId: currentListId,
        source,
        target,
        label: values.label || null
    });

    if (response.created) {
        closeLeftMenus();
        await loadDirectoryData();
        await renderDirectoryTree();
    }
}

async function travelToItem(target) {
    if (target.type === "database") {
        selectedDatabaseId = target.databaseId;
        selectedTableName = null;
        selectedRecordId = null;
        expandAncestors(target.databaseId);
        await renderDirectoryTree();
        return;
    }

    if (target.type === "table") {
        selectedDatabaseId = target.databaseId;
        selectedTableName = target.tableName;
        selectedRecordId = null;
        expandAncestors(target.databaseId);
        expandedItems.add(itemKey({ type: "database", databaseId: target.databaseId }));
        await renderDirectoryTree();
        await openTable(target.databaseId, target.tableName);
        return;
    }

    if (target.type === "record") {
        selectedDatabaseId = target.databaseId;
        selectedTableName = target.tableName;
        selectedRecordId = target.recordId;
        expandAncestors(target.databaseId);
        expandedItems.add(itemKey({ type: "database", databaseId: target.databaseId }));
        await renderDirectoryTree();
        await openTable(target.databaseId, target.tableName);
    }
}

function expandAncestors(databaseId) {
    let current = directoryDatabases.find(database => database.id === Number(databaseId));

    while (current) {
        expandedItems.add(itemKey({ type: "database", databaseId: current.id }));
        current = directoryDatabases.find(database => database.id === current.parentId);
    }
}

function closeLeftMenus() {
    buttons.forEach(button => {
        const menuId = button.dataset.actionTarget;
        document.querySelector(`#${menuId}`)?.remove();
        button.classList.remove("active");
    })
}

function appendLine(container, text, depth = 0) {
    const line = document.createElement("p");
    line.textContent = text;
    line.style.marginLeft = `${depth * 0.25}in`;
    container.appendChild(line);
    return line;
}

function markSelected(line, container) {
    container.querySelectorAll(".selected").forEach(item => {
        item.classList.remove("selected");
        item.style.outline = "";
    });

    line.classList.add("selected");
    line.style.outline = "2px solid var(--border)";
}

function createContextMenu(id, e) {
    document.querySelector("#recordContextMenu")?.remove();
    document.querySelector("#directoryContextMenu")?.remove();
    document.querySelector("#relatedContextMenu")?.remove();
    document.querySelector("#contextMenu")?.remove();

    const menu = document.createElement("div");
    menu.id = id;
    menu.style.position = "fixed";
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    menu.style.background = "var(--bg)";
    menu.style.border = "3px solid var(--border)";
    menu.style.zIndex = "1000";
    menu.style.padding = "10px";
    return menu;
}

function directDatabaseDependantCount(databaseId) {
    const childDatabaseCount = directoryDatabases.filter(database => database.parentId === databaseId).length;
    const tableCount = (directoryTables.get(databaseId) || []).length;
    return childDatabaseCount + tableCount;
}

function directFolderDependantCount(folderId) {
    const childFolderCount = directoryFolders.filter(folder => folder.parentId === folderId).length;
    const databaseCount = directoryDatabases.filter(database => !database.parentId && database.directoryId === folderId).length;
    return childFolderCount + databaseCount;
}

function toggleExpanded(key) {
    if (expandedItems.has(key)) {
        expandedItems.delete(key);
    } else {
        expandedItems.add(key);
    }
}

function isExpanded(key) {
    return expandAll || expandedItems.has(key);
}

function itemKey(item) {
    if (item.type === "folder") return `folder:${item.folderId}`;
    if (item.type === "database") return `database:${item.databaseId}`;
    if (item.type === "table") return `table:${item.databaseId}:${item.tableName}`;
    return `record:${item.databaseId}:${item.tableName}:${item.recordId}`;
}

function currentSelectionItem() {
    if (selectedRecordId) {
        return {
            type: "record",
            databaseId: selectedDatabaseId,
            tableName: selectedTableName,
            recordId: selectedRecordId
        };
    }

    if (selectedTableName) {
        return {
            type: "table",
            databaseId: selectedDatabaseId,
            tableName: selectedTableName
        };
    }

    if (selectedDatabaseId) {
        return {
            type: "database",
            databaseId: selectedDatabaseId
        };
    }

    return null;
}

function linkSource(link) {
    return {
        type: link.sourceType,
        databaseId: link.sourceDatabaseId,
        tableName: link.sourceTableName,
        recordId: link.sourceRecordId
    };
}

function linkTarget(link) {
    return {
        type: link.targetType,
        databaseId: link.targetDatabaseId,
        tableName: link.targetTableName,
        recordId: link.targetRecordId
    };
}

function sameItem(a, b) {
    return a.type === b.type
        && Number(a.databaseId || 0) === Number(b.databaseId || 0)
        && String(a.tableName || "") === String(b.tableName || "")
        && Number(a.recordId || 0) === Number(b.recordId || 0);
}

function relatedLabel(link, target) {
    if (link.label) return link.label;
    if (target.type === "database") {
        const database = directoryDatabases.find(item => item.id === Number(target.databaseId));
        return database ? database.name : `database ${target.databaseId}`;
    }
    if (target.type === "table") return `${target.tableName}`;
    return `${target.tableName} #${target.recordId}`;
}

function selectTarget(target) {
    selectedDatabaseId = target.databaseId;
    selectedTableName = target.tableName || null;
    selectedRecordId = target.recordId || null;
}

function recordSummary(data) {
    if (!data || Object.keys(data).length === 0) {
        return "{}";
    }

    if (data.type === "image") return `[image] ${data.title || data.file?.name || ""}`;
    if (data.type === "file") return `[file] ${data.title || data.file?.name || ""}`;
    if (data.title) return data.title;
    if (data.name) return data.name;

    return JSON.stringify(data);
}

function parseModalJson(json) {
    try {
        return JSON.parse(json || "{}");
    } catch {
        openModal({ title: "ALERT", message: "Record data must be valid JSON.", confirmText: "OK", hideCancel: true });
        return null;
    }
}

function parseFieldList(value) {
    return String(value || "")
        .split(",")
        .map((part, index) => {
            const [name, fieldType = "text"] = part.split(":").map(item => item.trim());
            return {
                name,
                fieldType,
                sortOrder: index
            };
        })
        .filter(field => field.name);
}

function renderMainRForm({
    title,
    message = "",
    fields = [],
    submitText = "Create",
    onSubmit
}) {
    main_R.innerHTML = "";

    const titleEl = appendLine(main_R, title);
    titleEl.classList.add("bold", "underlined");

    if (message) {
        appendLine(main_R, message);
    }

    const form = document.createElement("form");
    form.style.display = "grid";
    form.style.gap = "10px";
    form.style.maxWidth = "520px";

    fields.forEach(field => {
        const label = document.createElement("label");
        label.textContent = field.label;
        label.style.display = "grid";
        label.style.gap = "4px";

        const input = field.type === "textarea"
            ? document.createElement("textarea")
            : document.createElement("input");

        input.name = field.name;
        input.value = field.value ?? "";

        if (field.type === "file") {
            input.type = "file";
            if (field.accept) input.accept = field.accept;
        } else if (field.type !== "textarea") {
            input.type = field.type || "text";
        }

        input.style.boxSizing = "border-box";
        input.style.width = "100%";
        label.appendChild(input);
        form.appendChild(label);
    });

    const actions = document.createElement("div");

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = submitText;
    submit.classList.add("button");
    actions.appendChild(submit);

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "Cancel";
    cancel.classList.add("button");
    cancel.addEventListener("click", () => {
        main_R.innerHTML = "";
    });
    actions.appendChild(cancel);
    form.appendChild(actions);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const values = {};

        for (const field of fields) {
            const input = form.elements[field.name];

            if (field.type === "file") {
                const file = input.files?.[0];
                values[field.name] = file ? await readFileInput(file) : null;
            } else {
                values[field.name] = input.value;
            }
        }

        await onSubmit(values);
    });

    main_R.appendChild(form);
}

async function openModal({
    title = "ALERT",
    message = "",
    fields = [],
    confirmText = "Confirm",
    cancelText = "Cancel",
    hideCancel = false
} = {}) {
    document.querySelector("#alert")?.remove();

    return new Promise(resolve => {
        const alert = document.createElement("div");
        alert.id = "alert";
        alert.style.backgroundColor = "var(--bg)";
        alert.style.border = "3px solid var(--border)";
        alert.style.zIndex = "10000";
        alert.style.position = "fixed";
        alert.style.left = "50%";
        alert.style.top = "150px";
        alert.style.transform = "translateX(-50%)";
        alert.style.padding = "20px";
        alert.style.minWidth = "260px";
        alert.style.maxWidth = "520px";

        const titleEl = document.createElement("span");
        titleEl.classList.add("bold", "underlined");
        titleEl.textContent = title;
        alert.appendChild(titleEl);

        if (message) {
            const messageEl = document.createElement("p");
            messageEl.textContent = message;
            alert.appendChild(messageEl);
        }

        const controls = [];

        fields.forEach(field => {
            const label = document.createElement("label");
            label.textContent = field.label;
            label.style.display = "block";
            label.style.marginTop = "10px";
            alert.appendChild(label);

            const input = field.type === "textarea"
                ? document.createElement("textarea")
                : document.createElement("input");

            input.name = field.name;
            input.value = field.value ?? "";

            if (field.type === "file") {
                input.type = "file";
                if (field.accept) input.accept = field.accept;
            } else if (field.type !== "textarea") {
                input.type = field.type || "text";
            }

            input.style.display = "block";
            input.style.width = "100%";
            input.style.boxSizing = "border-box";
            alert.appendChild(input);
            controls.push({ field, input });
        });

        const actions = document.createElement("div");
        actions.style.marginTop = "14px";

        if (!hideCancel) {
            const cancel = document.createElement("p");
            cancel.id = "cancel";
            cancel.textContent = cancelText;
            cancel.classList.add("button", "underlined");
            cancel.style.display = "inline-flex";
            cancel.addEventListener("click", () => {
                alert.remove();
                resolve(null);
            });
            actions.appendChild(cancel);
        }

        const confirm = document.createElement("p");
        confirm.id = "confirm";
        confirm.textContent = confirmText;
        confirm.classList.add("button", "underlined");
        confirm.style.display = "inline-flex";
        confirm.addEventListener("click", async () => {
            const values = {};

            for (const { field, input } of controls) {
                if (field.type === "file") {
                    const file = input.files?.[0];
                    values[field.name] = file ? await readFileInput(file) : null;
                } else {
                    values[field.name] = input.value;
                }
            }

            alert.remove();
            resolve(fields.length ? values : true);
        });
        actions.appendChild(confirm);
        alert.appendChild(actions);
        body.appendChild(alert);
    });
}

function readFileInput(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const dataUrl = reader.result;
            const contentBase64 = String(dataUrl).split(",")[1] || "";
            resolve({
                name: file.name,
                type: file.type,
                contentBase64
            });
        });
        reader.addEventListener("error", reject);
        reader.readAsDataURL(file);
    });
}

async function getJson(url) {
    const response = await fetch(url);
    return response.json();
}

async function postJson(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return response.json();
}
