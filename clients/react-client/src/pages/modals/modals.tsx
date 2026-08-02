import { useState, type SubmitEventHandler } from "react";
import { navigate } from "../../componants/main";

import CreateFile from "./files/create";
import { functions } from "./files/files";

const { createFile } = functions;

const modals = {
  createFile: CreateFile,
} as const;

type ModalName = keyof typeof modals;

function Modals() {
  const [name, setName] = useState("");
  const [type, setType] = useState("txt");

  // Determine which modal should be displayed.
  const params = new URLSearchParams(window.location.search);
  const modal = params.get("modal");

  const CurrentModal =
    modal && modal in modals ? modals[modal as ModalName] : null;

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const gift = await createFile(name, type);

      if (gift.status) {
        // Return to the home page after creating the file.
        navigate("home");
      }
    } catch (err) {
      console.error("Failed to create file:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {CurrentModal ? (
        <CurrentModal
          name={name}
          setName={setName}
          type={type}
          setType={setType}
        />
      ) : (
        <p>No modal selected.</p>
      )}

      <button type="submit">Create</button>
    </form>
  );
}

export default Modals;
