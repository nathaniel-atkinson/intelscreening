console.log("files router loaded");

import Router from "express";
import { files } from "../utilities/files.js";

const router = Router();

router.get("/getDir", async (req, res) => {
  try {
    const result = await files.getDir();
    res.json(result);
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
    const result = await files.createFile(fileName, fileType);

    console.log(`createFile(${fileName}.${fileType}).STATUS = `, true);

    res.json(result);
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
    const result = await files.fetchFile(fileName);

    console.log("File fetched successfully");

    res.json(result);
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

    console.log("Viewing file:", fileName);

    const content = await files.fetchFile(fileName);

    res.type("text/plain").send(content);
  } catch (error) {
    console.error("Failed to fetch file:", error);

    res.status(404).json({
      error: "File not found",
    });
  }
});

router.put("/view/:fileName", async (req, res) => {
  try {
    const fileName = req.params.fileName;
    const content = req.body;

    console.log("Writing file:", fileName);

    await files.writeFile(fileName, content);

    console.log("File written successfully");

    res.status(200).json({
      success: true,
      fileName,
    });
  } catch (error) {
    console.error("Failed to write file:", error);

    res.status(500).json({
      success: false,
      error: "Failed to write file",
    });
  }
});

export default router;
