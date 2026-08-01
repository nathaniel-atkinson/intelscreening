async function createFile(name: string, type: string): Promise<Response> {
  const data = await fetch("/api/files/createFile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: name,
      fileType: type,
    }),
  });

  return data;
}

export const functions = { createFile };
