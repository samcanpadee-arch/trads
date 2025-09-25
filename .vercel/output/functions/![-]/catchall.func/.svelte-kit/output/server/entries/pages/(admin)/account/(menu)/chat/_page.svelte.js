import { W as head, $ as ensure_array_like, V as attr_class, X as stringify } from "../../../../../../chunks/index.js";
import { e as escape_html } from "../../../../../../chunks/escaping.js";
import { a as attr } from "../../../../../../chunks/attributes.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let messages = [
      {
        role: "assistant",
        content: "Hi! I'm your AI helper. How can I help today?"
      }
    ];
    const models = [
      { id: "gpt-4o-mini", label: "Fast" },
      { id: "gpt-4o", label: "Best" }
    ];
    let model = models[0].id;
    let input = "";
    let streaming = false;
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Chat</title>`);
      });
    });
    $$renderer2.push(`<div class="flex flex-col h-full"><div class="mb-3 flex items-center gap-3"><h1 class="text-2xl font-bold">Chat</h1> <div class="ml-auto flex items-center gap-2"><label class="text-sm opacity-80" for="modelSelect">Model</label> `);
    $$renderer2.select(
      {
        id: "modelSelect",
        class: "select select-bordered select-sm",
        value: model,
        disabled: streaming
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(models);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let m = each_array[$$index];
          $$renderer3.option({ value: m.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(m.label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(` <button class="btn btn-ghost btn-sm"${attr("disabled", streaming, true)}>Clear</button></div></div> <div class="flex-1 overflow-y-auto space-y-4 p-4 rounded bg-base-200"><!--[-->`);
    const each_array_1 = ensure_array_like(messages);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let m = each_array_1[$$index_1];
      $$renderer2.push(`<div${attr_class(`chat ${stringify(m.role === "user" ? "chat-end" : "chat-start")}`)}><div class="chat-bubble whitespace-pre-wrap">${escape_html(m.content)}</div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <form class="mt-4 flex gap-2"><textarea class="textarea textarea-bordered flex-1 min-h-[48px]" placeholder="Ask me anything… (Ctrl/Cmd+Enter to send)">`);
    const $$body = escape_html(input);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> <button class="btn btn-primary"${attr("disabled", !input.trim(), true)}>`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`Send`);
    }
    $$renderer2.push(`<!--]--></button></form></div>`);
  });
}
export {
  _page as default
};
