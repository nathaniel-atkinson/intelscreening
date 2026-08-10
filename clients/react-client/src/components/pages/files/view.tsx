import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFile, writeFile } from "../../../services/filesService.js";
import ReactMarkdown from "react-markdown";

function View() {
  const [editMode, setEditMode] = useState(true);

  const { fileName } = useParams<{ fileName: string }>();

  const [content, setContent] = useState("");

  useEffect(() => {
    if (!fileName) {
      return;
    }

    const name: string = fileName;

    async function loadData() {
      try {
        const textContent = await fetchFile({
          fileName: name,
        });

        console.log(textContent);
        setContent(textContent);
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, [fileName]);

  if (!fileName) {
    return <div>No file specified.</div>;
  }

  function handleOnChange(data: string) {
    setContent(data);

    if (!fileName) return;

    writeFile({
      fileName,
      data,
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Tab") {
      event.preventDefault();

      const textarea = event.currentTarget;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newContent =
        content.substring(0, start) + "\t" + content.substring(end);

      setContent(newContent);

      requestAnimationFrame(() => {
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = start + 1;
      });
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {editMode ? (
        <textarea
          value={content}
          onChange={(event) => handleOnChange(event.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            whiteSpace: "pre-wrap",
          }}
        />
      ) : (
        <ReactMarkdown>{content}</ReactMarkdown>
      )}
    </Suspense>
  );
}

export default View;
