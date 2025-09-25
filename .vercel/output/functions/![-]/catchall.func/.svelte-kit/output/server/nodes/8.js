

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/app/_layout.svelte.js')).default;
export const universal = {
  "ssr": false,
  "prerender": false
};
export const universal_id = "src/routes/app/+layout.ts";
export const imports = ["_app/immutable/nodes/8.D5PWWNvB.js","_app/immutable/chunks/DbI-BAT7.js","_app/immutable/chunks/DpahKekj.js","_app/immutable/chunks/eNEize8k.js","_app/immutable/chunks/BeFxbgWG.js","_app/immutable/chunks/DS6mqrkB.js","_app/immutable/chunks/Boa6Ahar.js","_app/immutable/chunks/JubLllKb.js","_app/immutable/chunks/DLgYKsuH.js","_app/immutable/chunks/aEmS48gQ.js","_app/immutable/chunks/BoqBtSLs.js","_app/immutable/chunks/gnU0ypJ3.js","_app/immutable/chunks/btn1nWV7.js","_app/immutable/chunks/DF0FGNug.js","_app/immutable/chunks/BAvt4X04.js","_app/immutable/chunks/Cm5o7Fn9.js","_app/immutable/chunks/PeYx4tiD.js"];
export const stylesheets = [];
export const fonts = [];
