import { V as attr_class, X as stringify } from "../../../../chunks/index.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    let isEurope = false;
    try {
      isEurope = Intl.DateTimeFormat().resolvedOptions().timeZone.startsWith("Europe/");
    } catch (e) {
    }
    $$renderer2.push(`<div class="text-center content-center max-w-lg mx-auto min-h-[70vh] pb-12 flex items-center place-content-center"><div class="flex flex-col w-64 lg:w-80">`);
    children?.($$renderer2);
    $$renderer2.push(`<!----> <div${attr_class(`mt-8 ${stringify(isEurope ? "block" : "hidden")}`)}>🍪 Logging in uses Cookies 🍪</div></div></div>`);
  });
}
export {
  _layout as default
};
