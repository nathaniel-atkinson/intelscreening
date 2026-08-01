import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/files/getDir", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        term: "database files",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching directory files:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div id="page">
      <header>
        <p>header</p>
      </header>
      <nav>
        <p>nav</p>
      </nav>
      <main>
        <p>main</p>
        <div style={{ padding: "2rem" }}>
          <p>
            <b>Directory Files Selector</b>
          </p>

          {loading ? (
            <p>Loading files...</p>
          ) : (
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
            >
              <option value="" disabled>
                -- Select a file --
              </option>
              {files.map((file, index) => (
                <option key={index} value={file}>
                  {file}
                </option>
              ))}
            </select>
          )}

          {selectedFile && (
            <p>
              You selected: <strong>{selectedFile}</strong>
            </p>
          )}
        </div>
      </main>
      <footer>
        <p>footer</p>
      </footer>
    </div>
  );
}

export default App;
