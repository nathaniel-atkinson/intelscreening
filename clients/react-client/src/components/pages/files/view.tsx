import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function View() {
  const { fileName } = useParams<{ fileName: string }>();

  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileName) return;

    const name = fileName;

    async function loadFile() {
      try {
        const response = await fetch(
          `/api/files/view/${encodeURIComponent(name)}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to load ${name}`);
        }

        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    loadFile();
  }, [fileName]);

  async function saveFile() {
    if (!fileName) return;

    try {
      const response = await fetch(
        `/api/files/view/${encodeURIComponent(fileName)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "text/plain",
          },
          body: content,
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to save ${fileName}`);
      }

      console.log(`Saved ${fileName}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save file");
    }
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <h1>{fileName}</h1>

      <button onClick={saveFile}>Save</button>

      <textarea
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "calc(100% - 50px)",
          boxSizing: "border-box",
          resize: "none",
        }}
      />
    </div>
  );
}
