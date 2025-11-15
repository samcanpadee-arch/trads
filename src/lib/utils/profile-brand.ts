import type { Database } from "../../DatabaseDefinitions";

export type ProfileBasics = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "full_name" | "company_name" | "website"
>;

function clean(value: string | null | undefined): string {
  return (value ?? "").trim();
}

export function profileBrandLines(profile?: ProfileBasics | null): string[] {
  if (!profile) return [];
  const lines: string[] = [];
  const company = clean(profile.company_name);
  const owner = clean(profile.full_name);
  const website = clean(profile.website);

  if (company) {
    lines.push(`Business name: ${company}`);
  }
  if (owner) {
    lines.push(`Owner / main contact: ${owner}`);
  }
  if (website) {
    lines.push(`Website or booking link: ${website}`);
  }

  return lines;
}

export function profileBrandContext(profile?: ProfileBasics | null): string | null {
  const lines = profileBrandLines(profile);
  return lines.length ? lines.join("\n") : null;
}

export function profileSignature(profile?: ProfileBasics | null): string | null {
  const company = clean(profile?.company_name);
  const website = clean(profile?.website);

  if (company && website) {
    return `${company} · ${website}`;
  }
  if (company) {
    return company;
  }
  if (website) {
    return website;
  }
  return null;
}
