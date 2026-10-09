import express from "express";
import fileRoutes from "./files.js";
import dictionaryRoutes from "./dictionary.js";

const routes = express();

routes.use("/files", fileRoutes);
routes.use("/dictionary", dictionaryRoutes);

const apiRoutes = routes;
export default apiRoutes;
