//---Get Dir---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

export async function getDir() {
  return fetch("/api/files/getDir");
}

//---Create File---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

interface CreateFileData {
  name: string;
  type: string;
}
export async function createFile(data: CreateFileData) {
  return fetch("/api/files/getDir", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: data.name,
      fileType: data.type,
    }),
  });
}
