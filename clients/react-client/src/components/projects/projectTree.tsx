import { useState, useEffect } from "react";
import { Suspense } from "react";
import { getDir, fetchFile } from "../../services/filesService.js";
import { Routes, Route, Link } from "react-router-dom";
import View from "../pages/files/view.js";

function Directory() {
  const [files, setFiles] = useState<string[]>([]);
  const [page, setPage] = useState<string>("");

  useEffect(() => {
    async function loadFiles() {
      const gift = await getDir();
      const data = await gift;
      setFiles(data);
    }

    loadFiles();
  }, []);

  function Entries() {
    return files.map((file) => (
      <div key={file}>
        <Link
          to={`/files/view/${file}`}
          className="selectable"
          onClick={() => handleFileClick(file)}
        >
          {file}
        </Link>
        <br></br>
      </div>
    ));
  }

  async function handleFileClick(file: string) {
    try {
    } catch (error) {
      console.error(`Failed to fetch file "${file}":`, error);
    }
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Entries />}></Route>
        <Route path="/view/:fileName" element={<View />}></Route>
      </Routes>
    </div>
  );
}

function ProjectTree() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Directory />
      </Suspense>
    </>
  );
}

export default ProjectTree;
