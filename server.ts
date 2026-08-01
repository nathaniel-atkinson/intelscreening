import express from "express";

const app = express();
const PORT = 3525;

app.get("/", (_req, res) => {
    res.send("Hello, world!");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});