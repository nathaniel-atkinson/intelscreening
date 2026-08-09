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
      <p key={file} className="selectable" onClick={fetchFile(file)}>
        {file}
      </p>
    ));
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
