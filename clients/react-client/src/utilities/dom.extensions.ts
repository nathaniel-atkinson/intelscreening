import { data } from "react-router-dom";

export {};

declare global {
  function continueIf(condition: boolean, callback?: () => void): boolean;
  function stopIf(condition: boolean, callback?: () => void): boolean;
  interface Element {
    class(
      className: string,
      instruct: boolean | "toggle",
      unique?: boolean | "override",
    ): this;
    dataClass(className: string, instruct: boolean | "toggle"): this;
  }
  interface Math {
    rand: {
      (): number;
      range(max: number, min?: number): number;
    };
  }
}

globalThis.stopIf = (condition: boolean, callback?: () => void): boolean => {
  if (condition) callback?.();

  return condition;
};

globalThis.continueIf = (
  condition: boolean,
  callback?: () => void,
): boolean => {
  if (condition) callback?.();
  return condition;
};

Math.rand = Object.assign(() => Math.random(), {
  range(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min) + min);
  },
});

declare global {
  interface Element {
    dataClass(className: string, instruct: boolean | "toggle"): this;
  }
}

Element.prototype.dataClass = function (
  className: string,
  instruct: boolean | "toggle",
) {
  const dataClassList: string[] = (this.getAttribute("data-class") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const exists = dataClassList.includes(className);

  switch (instruct) {
    case true:
      if (!exists) {
        dataClassList.push(className);
      }
      break;

    case false:
      if (exists) {
        dataClassList.splice(dataClassList.indexOf(className), 1);
      }
      break;

    case "toggle":
      if (exists) {
        dataClassList.splice(dataClassList.indexOf(className), 1);
      } else {
        dataClassList.push(className);
      }
      break;
  }

  if (dataClassList.length > 0) {
    this.setAttribute("data-class", dataClassList.join(","));
  } else {
    this.removeAttribute("data-class");
  }

  return this;
};

Element.prototype.class = function (
  className: string,
  instruct: boolean | "toggle",
  unique: boolean | "override" = false,
) {
  if (unique === "override") {
    document.querySelectorAll("*").forEach((item) => {
      if (item !== this) {
        item.classList.remove(className);
      }
    });
  } else if (unique) {
    const group = this.getAttribute("data-class")?.split(",")[0]?.trim();

    continueIf(Boolean(group), () => {
      if (!group) return;

      document.querySelectorAll("[data-class]").forEach((item) => {
        const groups = item
          .getAttribute("data-class")
          ?.split(",")
          .map((value) => value.trim());

        if (item !== this && groups?.includes(group)) {
          item.classList.remove(className);
        }
      });
    });
  }

  switch (instruct) {
    case true:
      this.classList.add(className);
      break;

    case false:
      this.classList.remove(className);
      break;

    case "toggle":
      this.classList.toggle(className);
      break;
  }

  return this;
};
