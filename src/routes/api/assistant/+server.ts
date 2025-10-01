import type { RequestHandler } from "./$types";
import { json, redirect } from "@sveltejs/kit";
import { getPendingStoreId } from "$lib/server/assistant_stores";
import { getUserTier } from "$lib/server/subscription_tiers";

const FILE_FIELD_CANDIDATES = ["file", "files", "files[]", "upload", "document", "documents"];

