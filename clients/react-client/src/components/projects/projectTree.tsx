import { useState, useEffect } from "react";
import { Suspense } from "react";
import { getDir, fetchFile } from "../../services/filesService.js";

function Directory() {
  const [files, setFiles] = useState<string[]>([]);

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
      <p
        key={file}
        className="selectable"
        onClick={() => handleFileClick(file)}
      >
        {file}
      </p>
    ));
  }

  async function handleFileClick(file: string) {
    try {
      const data = await fetchFile({ file });
      console.log(data);
    } catch (error) {
      console.error(`Failed to fetch file "${file}":`, error);
    }
  }

  return (
    <div>
      <Entries />
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
