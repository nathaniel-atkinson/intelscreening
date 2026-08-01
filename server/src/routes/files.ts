import Router from "express";
import { files } from "../utilities/files.js";

const router = Router();

router.get("/getDir", files.getDir);

export default router;
