import express from "express";

import app from "./app.js";
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.json({
    message: "Intel Screening Server running",
    port: PORT,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
