//---Get Dir---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

export async function getDir() {
  const gift = await fetch("/api/files/getDir");
  return gift.json();
}

//---Fetch File---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
interface FetchFileData {
  file: string;
}
export async function fetchFile(data: FetchFileData) {
  const gift = await fetch("/api/files/fetch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: data.file,
    }),
  });
  return gift.json();
}

//---Create File---:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

interface CreateFileData {
  name: string;
  type: string;
}
export async function createFile(data: CreateFileData) {
  const gift = await fetch("/api/files/getDir", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: data.name,
      fileType: data.type,
    }),
  });
  return gift.json();
}
