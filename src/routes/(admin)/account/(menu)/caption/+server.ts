import { redirect } from '@sveltejs/kit';

export const GET = ({ url }) => {
  throw redirect(308, `/account/tools${url.search}`);
};
export const HEAD = GET;
export const POST = GET;
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
