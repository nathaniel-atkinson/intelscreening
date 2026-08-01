console.log("api router loaded");
import Router from "express";
import fileRoutes from "../routes/files.js";

const router = Router();

router.use("/files", fileRoutes);

export default router;
