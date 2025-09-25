import { a as attr } from "../../../chunks/attributes.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let input = "";
    let output = "";
    let sending = false;
    $$renderer2.push(`<h1 class="text-2xl font-bold mb-4">Chat Tester</h1> <form class="space-y-3"><input class="border rounded px-3 py-2 w-full"${attr("value", input)} placeholder="Ask something…"/> <button class="bg-black text-white rounded px-4 py-2"${attr("disabled", sending, true)}>${escape_html("Send")}</button></form> <pre class="mt-4 whitespace-pre-wrap border rounded p-3">${escape_html(output)}</pre>`);
  });
}
export {
  _page as default
};
