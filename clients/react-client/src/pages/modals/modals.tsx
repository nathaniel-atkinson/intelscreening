import { useState } from "react";
import Create from "./files/create";
import { functions } from "./files/files";

const { createFile } = functions;

function Modals() {
  const [name, setName] = useState("");
  const [type, setType] = useState("txt");

  async function handleSubmit(e: any) {
    e.preventDefault();

    await createFile(name, type);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Create name={name} setName={setName} type={type} setType={setType} />

      <button type="submit">Create</button>
    </form>
  );
}

export default Modals;
