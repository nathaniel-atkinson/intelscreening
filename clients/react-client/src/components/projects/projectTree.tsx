import { ReactNode, Suspense } from "react";
import { getDir } from "../../services/filesService";

const projects = [
  { id: 1, name: "Boggle" },
  { id: 2, name: "Casting Shadows" },
  { id: 3, name: "Kentucky Derby Poker" },
];

function Items() {
  return projects.map((item) => <p key={item.id}>{item.name}</p>);
}

function Directory() {
  const gift = getDir();
  return <p>{gift}</p>;
}

function ProjectTree() {
  return (
    <>
      <main>
        <p>Main</p>
      </main>
      <Suspense fallback={<div>Loading...</div>}>
        <Directory />
      </Suspense>
    </>
  );
}

export default ProjectTree;
