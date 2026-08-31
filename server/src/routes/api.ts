import express from "express";
import fileRoutes from "./files.js";

const routes = express();

routes.use("/files", fileRoutes);

const apiRoutes = routes;
export default apiRoutes;
