const pages = import.meta.glob("./*.tsx", {
  eager: true,
});

export const nestedFilePages = import.meta.glob("./files/*.tsx", {
  eager: true,
});

export default pages;
