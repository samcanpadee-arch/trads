import { Y as attributes, Z as bind_props, X as stringify, _ as slot } from "../../../chunks/index.js";
import { s as setSidebar, P as Provider, c as cn, S as SIDEBAR_COOKIE_NAME, a as SIDEBAR_COOKIE_MAX_AGE, b as SIDEBAR_WIDTH, d as SIDEBAR_WIDTH_ICON } from "../../../chunks/sheet-content.js";
import "clsx";
import { c as clsx } from "../../../chunks/attributes.js";
function Sidebar_provider($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      ref = null,
      open = true,
      onOpenChange = () => {
      },
      class: className,
      style,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    setSidebar({
      open: () => open,
      setOpen: (value) => {
        open = value;
        onOpenChange(value);
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      }
    });
    $$renderer2.push(`<!---->`);
    Provider($$renderer2, {
      delayDuration: 0,
      children: ($$renderer3) => {
        $$renderer3.push(`<div${attributes({
          "data-slot": "sidebar-wrapper",
          style: `--sidebar-width: ${stringify(SIDEBAR_WIDTH)}; --sidebar-width-icon: ${stringify(SIDEBAR_WIDTH_ICON)}; ${stringify(style)}`,
          class: clsx(cn("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", className)),
          ...restProps
        })}>`);
        children?.($$renderer3);
        $$renderer3.push(`<!----></div>`);
      }
    });
    $$renderer2.push(`<!---->`);
    bind_props($$props, { ref, open });
  });
}
function _layout($$renderer, $$props) {
  Sidebar_provider($$renderer, {
    children: ($$renderer2) => {
      Provider($$renderer2, {
        children: ($$renderer3) => {
          $$renderer3.push(`<!--[-->`);
          slot($$renderer3, $$props, "default", {});
          $$renderer3.push(`<!--]-->`);
        }
      });
    },
    $$slots: { default: true }
  });
}
export {
  _layout as default
};
