console.log("files.ts loaded");

import type { PathLike } from "fs";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesDirectory = path.join(__dirname, "..", "database", "files");

// --- getDir ---------------------------------------------------------------

async function getDir(): Promise<string[]> {
  try {
    const files: string[] = await fs.readdir(filesDirectory);

    return files;
  } catch (error) {
    console.error(`Failed to get dir for path: ${filesDirectory}`, error);

    throw error;
  }
}

// --- createFile -----------------------------------------------------------

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

  const filePath = path.join(filesDirectory, `${fileName}.${fileType}`);

  console.log(`createFile(${fileName}.${fileType})`);

  try {
    await fs.writeFile(filePath, initialContent, "utf-8");

    console.log("createFile().STATUS =", true);

    return JSON.stringify({
      status: true,
      result: true,
      message: `Created file @${filePath}`,
    });
  } catch (error) {
    console.error("Failed to create file:", error);
    throw error;
  }
}

// --- writeFile ------------------------------------------------------------

async function writeFile(fileName: string, content: string): Promise<void> {
  const filePath = path.join(filesDirectory, fileName);

  console.log(`writeFile(${fileName})`);

  await fs.writeFile(filePath, content, "utf-8");
}

// --- fetchFile ------------------------------------------------------------

async function fetchFile(fileName: string): Promise<string> {
  const filePath = path.join(filesDirectory, fileName);

  console.log(`fetchFile(${fileName})`);

  const content = await fs.readFile(filePath, "utf-8");

  return content;
}

// --- EXPORTS --------------------------------------------------------------

export const files = {
  getDir,
  fetchFile,
  createFile,
  writeFile,
};
