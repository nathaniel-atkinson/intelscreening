import express from "express";
import fileRoutes from "./routes/files.js";

const app = express();

app.use(express.json());
app.use("/api/files", fileRoutes);

// Register routes here.

// Test API endpoint

export default app;
