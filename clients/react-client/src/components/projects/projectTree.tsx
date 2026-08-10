import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { getDir, createFile } from "../../services/filesService.js";

function Directory() {
  const [files, setFiles] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadFiles() {
      try {
        const data = await getDir();
        setFiles(data);
      } catch (error) {
        console.error("Failed to load directory:", error);
      }
    }

    loadFiles();
  }, []);

  function handleFileClick(file: string) {
    console.log(`Opening file: ${file}`);
  }

  return (
    <>
      <button type="button" onClick={() => setShowModal(true)}>
        Create File
      </button>

      <div>
        {files.map((file) => (
          <>
            <Link
              key={file}
              to={`/files/view/${encodeURIComponent(file)}`}
              className="selectable"
              onClick={() => handleFileClick(file)}
            >
              {file}
            </Link>
            <br></br>
          </>
        ))}
      </div>

      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </>
  );
}

interface ModalProps {
  onClose: () => void;
}

function Modal({ onClose }: ModalProps) {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("text");

  const fileTypes = ["text", "md", "json", "js", "css", "html"];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await createFile({
        name: fileName,
        type: fileType,
      });

      setFileName("");
      setFileType("text");
      onClose();

      // Reload the directory after creating the file.
      const data = await getDir();
      // This state belongs to Directory, so this part should
      // instead be handled by a callback or by returning the
      // newly-created file from createFile().
    } catch (error) {
      console.error("Failed to create file:", error);
    }
  }

  return createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={fileName}
            onChange={(event) => setFileName(event.target.value)}
            placeholder="fileName"
            required
          />

          <select
            value={fileType}
            onChange={(event) => setFileType(event.target.value)}
          >
            {fileTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <button type="submit">Create</button>

          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default Directory;
