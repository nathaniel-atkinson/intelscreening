import { dir } from "console";
import type { PathLike } from "fs";
import fs from "fs/promises";
import path from "path";

import { fileURLToPath } from "url";

// Equivalent to __dirname in ES Modules (if your project uses "type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//---getDir---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;

async function getDir(term: string): Promise<string[]> {
  let dirPath: PathLike;
  if (term === "database files") {
    dirPath = path.join(__dirname, "..", "database", "files");
  } else dirPath = path.join(__dirname, "..", "database", "files");
  try {
    const files: string[] = await fs.readdir(dirPath);
    return files;
  } catch (error) {
    console.error(`Failed to get dir for path: ${dirPath}`, error);
    throw error;
  }
}

//---createFile---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;

async function createFile(
  fileName: string,
  fileType: string,
  initialContent: string = "",
): Promise<string> {
  const filePath = path.join(
    __dirname,
    "..",
    "src",
    "database",
    `${fileName}.${fileType}`,
  );

  try {
    // Ensures existance of target directery
    fs.mkdir(path.dirname(filePath), { recursive: true });

    // Asynchronously write the file with proper async/await
    fs.writeFile(filePath, initialContent, "utf-8");
    console.log(`getDir().STATUS = success`);
    return filePath;
  } catch (error) {
    console.error("Failed to create file:", error);
    throw error;
  }
}

//---readDataFile---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;

async function readDataFile(fileName: string): Promise<string> {
  const filePath = path.join(__dirname, "../../data", fileName);
  return fs.readFile(filePath, "utf-8");
}

//---EXPORTS---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;

export const files = {
  getDir,
  readDataFile,
  createFile,
};
