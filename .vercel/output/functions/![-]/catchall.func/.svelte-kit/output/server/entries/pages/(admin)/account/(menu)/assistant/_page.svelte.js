import { $ as ensure_array_like } from "../../../../../../chunks/index.js";
import { a as attr } from "../../../../../../chunks/attributes.js";
import { e as escape_html } from "../../../../../../chunks/escaping.js";
function _page($$renderer) {
  let task = "";
  let logs = [];
  $$renderer.push(`<div class="space-y-4"><h1 class="text-2xl font-semibold">AI Assistant</h1> <p class="text-sm opacity-70">Agent-style assistant (tool use, RAG) will be wired next.</p> <form class="flex gap-2"><input class="input input-bordered flex-1"${attr("value", task)} placeholder="Describe what you need…"/> <button class="btn btn-primary" type="submit" disabled>Run (coming soon)</button></form> <div class="border rounded p-4 bg-base-100"><div class="text-xs uppercase opacity-60 mb-2">Activity</div> `);
  if (logs.length === 0) {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<p class="text-sm opacity-70">No runs yet.</p>`);
  } else {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]--> <ul class="list-disc ml-5 space-y-1"><!--[-->`);
  const each_array = ensure_array_like(logs);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let line = each_array[$$index];
    $$renderer.push(`<li class="text-sm">${escape_html(line)}</li>`);
  }
  $$renderer.push(`<!--]--></ul></div></div>`);
}
export {
  _page as default
};
