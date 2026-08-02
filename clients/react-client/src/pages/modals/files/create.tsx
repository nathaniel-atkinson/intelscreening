import "../../../componants/menus/menus.css";

type CreateProps = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
};

function CreateFile({ name, setName, type, setType }: CreateProps) {
  const types = ["txt", "md", "json"];

  return (
    <>
      <p>Create File</p>

      <input
        value={name}
        placeholder="File name"
        onChange={(e) => setName(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        {types.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </>
  );
}

export default CreateFile;
