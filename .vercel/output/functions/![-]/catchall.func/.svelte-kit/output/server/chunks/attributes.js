import { e as escape_html } from "./escaping.js";
import { clsx as clsx$1 } from "clsx";
const replacements = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (name === "hidden" && value !== "until-found") {
    is_boolean = true;
  }
  if (value == null || !value && is_boolean) return "";
  const normalized = name in replacements && replacements[name].get(value) || value;
  const assignment = is_boolean ? "" : `="${escape_html(normalized, true)}"`;
  return ` ${name}${assignment}`;
}
function clsx(value) {
  if (typeof value === "object") {
    return clsx$1(value);
  } else {
    return value ?? "";
  }
}
function to_class(value, hash, directives) {
  var classname = value == null ? "" : "" + value;
  if (hash) {
    classname = classname ? classname + " " + hash : hash;
  }
  return classname === "" ? null : classname;
}
export {
  attr as a,
  clsx as c,
  to_class as t
};
