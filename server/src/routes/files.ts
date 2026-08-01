console.log("files router loaded");
import Router from "express";
import { files } from "../utilities/files.js";

const router = Router();

router.post("/getDir", async (req, res) => {
  try {
    const gift = await files.getDir(req.body.term);
    res.json(gift);
  } catch (err) {
    res.status(500).json({
      error: String(err),
    });
  }
});

export default router;
