import { e as escape_html } from "../../../../../chunks/escaping.js";
import "clsx";
import "../../../../../chunks/client.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let { supabase } = data;
    let message = "Signing out....";
    $$renderer2.push(`<h1 class="text-2xl font-bold m-6 mx-auto my-auto">${escape_html(message)}</h1>`);
  });
}
export {
  _page as default
};
