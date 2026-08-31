import express from "express";
import fs from "fs/promises";
import path from "path";

const { writeFile, mkdir } = fs;

const files = express();

files.get;

files.post("/create", (req, res) => {
  const { fileName, fileType } = req.body;

  const filePath = path.join(__dirname, "../database");

  try {
    writeFile(`${filePath}/${fileName}.${fileType}`, "", "utf-8");
  } catch (err) {
    console.error(err);
  }
});

const fileRoutes = files;
export default fileRoutes;
