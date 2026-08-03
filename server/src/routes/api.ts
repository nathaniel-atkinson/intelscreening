console.log("api router loaded");
import Router from "express";
import fileRoutes from "../routes/files.js";
import projectRoutes from "../routes/projects.js";

const router = Router();

router.use("/files", fileRoutes);
router.use("/projects", projectRoutes);

export default router;
