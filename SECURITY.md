# Security Policy

## Reporting a Vulnerability

Please report any vulnerabilities via GitHub: https://github.com/CriticalMoments/CMSaasStarter/security

This allows us to privately fix and publish the fix before public disclosure.

## React2Shell (CVE-2025-66478) guardrails

This project is built with SvelteKit instead of Next.js or React Server Components, so it is not directly affected by the React2Shell vulnerability tracked as CVE-2025-66478. To prevent the vulnerable React Server Component packages from being introduced as direct or transitive dependencies in the future, `package.json` pins the `react-server-dom-webpack`, `react-server-dom-parcel`, and `react-server-dom-turbopack` packages to the patched `19.2.1` release.

If you add React/Next.js features later, run [`npx fix-react2shell-next`](https://github.com/vercel-labs/fix-react2shell-next) to validate your dependency graph and keep the pinned versions up to date.
