import { W as head, $ as ensure_array_like } from "../../../../../../chunks/index.js";
import { a as attr } from "../../../../../../chunks/attributes.js";
import { e as escape_html } from "../../../../../../chunks/escaping.js";
import { h as html } from "../../../../../../chunks/html.js";
function _page($$renderer) {
  const tools = [
    {
      title: "Material & Cost Calculator",
      desc: "Deterministic estimator with optional AI summary. Quickly price jobs and materials.",
      href: "/account/caption/material-cost",
      icon: "calculator"
    },
    {
      title: "Proposal Builder",
      desc: "Generate clean, client-ready proposals with your scope, inclusions, and T&Cs.",
      href: "/account/caption/proposal",
      icon: "doc"
    },
    {
      title: "Job Estimation Wizard",
      desc: "Guided estimation with presets for common job types.",
      soon: true,
      icon: "estimate"
    },
    {
      title: "Client Job Summary",
      desc: "Auto-summarise site notes and scope into a client-friendly recap.",
      soon: true,
      icon: "summary"
    },
    {
      title: "Review Responder",
      desc: "Draft thoughtful responses to customer reviews in your brand voice.",
      soon: true,
      icon: "review"
    },
    {
      title: "Social Media Generator",
      desc: "Turn job photos and notes into short posts and captions.",
      soon: true,
      icon: "social"
    },
    {
      title: "Email Template Generator",
      desc: "Create re-usable email templates for quotes, follow-ups and more.",
      soon: true,
      icon: "email"
    }
  ];
  const icons = {
    calculator: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6"><path fill="currentColor" d="M7 2h10a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3m0 2a1 1 0 0 0-1 1v14c0 .55.45 1 1 1h10a1 1 0 0 0 1-1V5c0-.55-.45-1-1-1zm2 3h6v3H9zm0 6h2v2H9zm0 4h2v2H9zm4-4h2v2h-2zm0 4h2v2h-2z"/></svg>`,
    doc: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6"><path fill="currentColor" d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m7 1.5V8h4.5zM7 11h10v2H7zm0 4h10v2H7z"/></svg>`,
    estimate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6"><path fill="currentColor" d="M3 4h18v2H3zm0 4h12v2H3zm0 4h18v2H3zm0 4h12v2H3z"/></svg>`,
    summary: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6"><path fill="currentColor" d="M5 3h14v2H5zm0 4h10v2H5zm0 4h14v2H5zm0 4h8v2H5z"/></svg>`,
    review: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6"><path fill="currentColor" d="M4 3h16v12H6l-2 2zm2 4v2h12V7zm0 4v2h8v-2z"/></svg>`,
    social: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6"><path fill="currentColor" d="M14 3a4 4 0 1 1 0 8a4 4 0 0 1 0-8M3 20c0-3.31 2.69-6 6-6h2a6 6 0 0 1 6 6v1H3z"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 4l-8 5L4 8V6l8 5l8-5z"/></svg>`
  };
  head($$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Caption · AI Tools</title>`);
    });
  });
  $$renderer.push(`<section class="flex flex-col gap-6"><header class="flex items-start justify-between"><div class="flex flex-col gap-1"><h1 class="text-2xl font-semibold">Caption</h1> <p class="text-sm opacity-70">AI tools to speed up quoting, proposals, and client comms.</p></div></header> <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"><!--[-->`);
  const each_array = ensure_array_like(tools);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let t = each_array[$$index];
    if (!t.soon && t.href) {
      $$renderer.push("<!--[-->");
      $$renderer.push(`<a class="card bg-base-100 border border-base-300 hover:shadow-lg transition focus:outline-none focus:ring focus:ring-primary/30"${attr("href", t.href)}${attr("aria-label", `Open ${t.title}`)} role="group"><div class="card-body gap-2"><div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><span class="sr-only">${escape_html(t.title)} icon</span> <span aria-hidden="true">${html(icons[t.icon])}</span></div> <h2 class="card-title text-base">${escape_html(t.title)}</h2></div> <p class="text-sm opacity-80">${escape_html(t.desc)}</p> <div class="mt-2"><span class="btn btn-sm btn-primary">Open<span class="ml-1" aria-hidden="true">→</span></span></div></div></a>`);
    } else {
      $$renderer.push("<!--[!-->");
      $$renderer.push(`<div class="card bg-base-100 border border-base-300 opacity-80 hover:shadow-lg transition"${attr("aria-label", `${t.title} coming soon`)}><div class="card-body gap-2"><div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-base-300/40 text-base-content/70"><span class="sr-only">${escape_html(t.title)} icon</span> <span aria-hidden="true">${html(icons[t.icon])}</span></div> <div class="flex items-center gap-2"><h2 class="card-title text-base">${escape_html(t.title)}</h2> <span class="badge badge-sm badge-neutral">Soon</span></div></div> <p class="text-sm opacity-80">${escape_html(t.desc)}</p> <div class="mt-2"><button class="btn btn-sm btn-disabled" aria-disabled="true">Coming soon</button></div></div></div>`);
    }
    $$renderer.push(`<!--]-->`);
  }
  $$renderer.push(`<!--]--></div></section>`);
}
export {
  _page as default
};
