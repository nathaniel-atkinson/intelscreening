import { useState, useEffect } from "react";
import { Suspense } from "react";
import { getDir } from "../../services/filesService.js";

function Directory() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function loadFiles() {
      const gift = await getDir();
      const data = await gift;
      setFiles(data);
    }

    loadFiles();
  }, []);

  return (
    <div>
      {files.map((file) => (
        <p key={file} className="selectable">
          {file}
        </p>
      ))}
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
