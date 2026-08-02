import { useState } from "react";
import { navigate } from "../../componants/main";
import "./menus.css";

type MenuOption = {
  label: string;
  modal: string;
};

function CreateMenu() {
  const [open, setOpen] = useState(false);

  const options: MenuOption[] = [
    { label: "File", modal: "createFile" },
    { label: "Folder", modal: "createFolder" },
    { label: "Directory", modal: "createDirectory" },
  ];

  function toggleMenu() {
    setOpen((prev) => !prev);
  }

  function openModal(modal: string) {
    navigate("modal", { modal });
    setOpen(false);
  }

  return (
    <>
      <p className="selectable" onClick={toggleMenu}>
        Create
      </p>

      {open && (
        <div className="create-menu">
          {options.map((option) => (
            <p
              key={option.modal}
              className="selectable create-option"
              onClick={() => openModal(option.modal)}
            >
              {option.label}
            </p>
          ))}
        </div>
      )}
    </>
  );
}

export default CreateMenu;
