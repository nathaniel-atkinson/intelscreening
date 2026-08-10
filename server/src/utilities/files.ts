console.log("files.ts loaded");
import { dir } from "console";
import type { PathLike } from "fs";
import fs from "fs/promises";
import path from "path";

import { fileURLToPath } from "url";

// Equivalent to __dirname in ES Modules (if your project uses "type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//---getDir---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;

async function getDir(): Promise<string[]> {
  let dirPath: PathLike;
  dirPath = path.join(__dirname, "..", "database", "files");
  try {
    const files: string[] = await fs.readdir(dirPath);
    return files;
  } catch (error) {
    console.error(`Failed to get dir for path: ${dirPath}`, error);
    throw error;
  }
}

//---createFile---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;

const date: Date = new Date();
const timeStamp = date.getDate().toString();

interface CreateFileData {
  fileName: string;
  fileType: string;
  initialContent: string;
}

async function createFile(
  data: CreateFileData,
  initialContent = timeStamp,
): Promise<string> {
  const { fileName, fileType } = data;

  const filePath: PathLike = path.join(
    __dirname,
    "..",
    "database",
    "files",
    `${fileName}.${fileType}`,
  );

  console.log(`createFile(${fileName}.${fileType})`);
  try {
    // Asynchronously write the file with proper async/await
    await fs.writeFile(filePath, initialContent, "utf-8");
    console.log(`createFile().STATUS =`, true);
    const gift: string = JSON.stringify({
      status: true,
      result: true,
      message: `Created file @${filePath}`,
    });
    return gift;
  } catch (error) {
    console.error("Failed to create file:", error);
    throw error;
  }
}

//---readDataFile---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;

async function fetchFile(fileName: string): Promise<string> {
  const filePath = path.join(__dirname, "../", "/database", "files", fileName);
  const gift = await fs.readFile(filePath, "utf-8");
  return gift;
}

//---EXPORTS---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;

export const files = {
  getDir,
  fetchFile,
  createFile,
};
