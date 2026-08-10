import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function View() {
  const { fileName } = useParams<{ fileName: string }>();

  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileName) return;

    async function loadFile() {
      try {
        const response = await fetch(
          `/api/files/view/${encodeURIComponent(fileName)}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to load ${fileName}`);
        }

        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    loadFile();
  }, [fileName]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main>
      <h1>{fileName}</h1>
      <pre>{content}</pre>
    </main>
  );
}
