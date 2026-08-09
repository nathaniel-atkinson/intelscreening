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
  const filePath: PathLike = path.join(
    __dirname,
    "../../database",
    "files",
    fileName,
  );
  try {
    const gift = files.fetchFile(filePath);
    res.json(gift);
  } catch (err) {
    res.status(500).json({
      error: String(err),
    });
  }
});

export default router;
