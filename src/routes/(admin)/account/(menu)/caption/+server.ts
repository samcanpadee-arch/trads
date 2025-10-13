import { redirect } from '@sveltejs/kit';

export const GET = ({ url }) => {
  // preserve the query string
  throw redirect(308, `/account/tools${url.search}`);
};

// Cover other HTTP methods too
export const HEAD = GET;
export const POST = GET;
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
