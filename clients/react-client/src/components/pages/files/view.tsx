import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFile } from "../../../services/filesService.js";

function View() {
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

  return (
    <textarea
      value={content}
      onChange={(event) => setContent(event.target.value)}
    />
  );
}

export default View;
