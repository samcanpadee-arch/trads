import type { PageServerLoad, Actions } from "./$types";
import { env as privateEnv } from "$env/dynamic/private";
import { redirect, fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }) => {
  const key = privateEnv.LIBRARY_ADMIN_KEY;
  const token = cookies.get("lib_admin") || "";
  const allowed = Boolean(key && token === "ok");
  return { allowed };
};

export const actions: Actions = {
  access: async ({ request, cookies }) => {
    const data = await request.formData();
    const provided = (data.get("key") as string || "").trim();
    if (!privateEnv.LIBRARY_ADMIN_KEY) {
      return fail(500, { error: "Server missing LIBRARY_ADMIN_KEY" });
    }
    if (!provided) {
      return fail(400, { error: "Enter the admin key" });
    }
    if (provided !== privateEnv.LIBRARY_ADMIN_KEY) {
      return fail(401, { error: "Incorrect key" });
    }
    cookies.set("lib_admin", "ok", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 6 // 6 hours
    });
    throw redirect(303, "/account/assistant/library");
  },
  logout: async ({ cookies }) => {
    cookies.delete("lib_admin", { path: "/" });
    throw redirect(303, "/account/assistant/library");
  }
};
