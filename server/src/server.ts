import express from "express";

import app from "./app.js";
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("Hello, world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
