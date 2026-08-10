console.log("files router loaded");
import Router from "express";
import { files } from "../utilities/files.js";
import path from "path";
import type { PathLike } from "fs";

const router = Router();

router.get("/getDir", async (req, res) => {
  try {
    const gift = await files.getDir();
    res.json(gift);
  } catch (err) {
    res.status(500).json({
      error: String(err),
    });
  }
});

router.post("/create", async (req, res) => {
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;
  console.log("/api/files/createFile");
  try {
    const gift = await files.createFile(fileName, fileType);
    console.log(`createFile(${fileName}.${fileType}).STATUS = `, true);
    res.json(gift);
  } catch (err) {
    res.status(500).json({
      error: String(err),
    });
  }
});

router.post("/fetch", async (req, res) => {
  const fileName: string = req.body.fileName;

  console.log("Fetching file:", fileName);

  try {
    const gift = await files.fetchFile(fileName);

    console.log("File fetched successfully");

    res.json(gift);
  } catch (err) {
    console.error("fetchFile failed:", err);

    res.status(500).json({
      error: String(err),
    });
  }
});

router.get("/view/:fileName", async (req, res) => {
  try {
    const fileName = req.params.fileName;

    const content = await files.fetchFile(fileName);

    res.type("text/plain").send(content);
  } catch (error) {
    console.error("Failed to fetch file:", error);

    res.status(404).json({
      error: "File not found",
    });
  }
});

export default router;
