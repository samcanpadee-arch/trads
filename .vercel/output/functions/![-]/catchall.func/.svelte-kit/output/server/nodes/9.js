import * as server from '../entries/pages/(admin)/account/(menu)/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(admin)/account/(menu)/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(admin)/account/(menu)/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.CjOq2ENN.js","_app/immutable/chunks/DbI-BAT7.js","_app/immutable/chunks/DpahKekj.js","_app/immutable/chunks/eNEize8k.js"];
export const stylesheets = [];
export const fonts = [];
