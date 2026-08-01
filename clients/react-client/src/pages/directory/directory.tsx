import { useState, useEffect } from "react";

function Directory() {
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
    <div style={{ padding: "10px" }}>
      <p>
        <b>Directory Files</b>
      </p>

      {loading ? (
        <p>Loading files...</p>
      ) : (
        <>
          <hr></hr>
          <div>
            {files.map((file, index) => (
              <p
                key={index}
                className="selectable"
                onClick={() => setSelectedFile(file)}
              >
                {file}
              </p>
            ))}
          </div>
        </>
      )}

      {selectedFile && (
        <>
          <hr></hr>
          <p>
            You selected: <strong>{selectedFile}</strong>
          </p>
        </>
      )}
    </div>
  );
}

export default Directory;
