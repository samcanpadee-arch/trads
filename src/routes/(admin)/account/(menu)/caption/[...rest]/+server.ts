import { redirect } from '@sveltejs/kit';

export const GET = ({ params, url }) => {
  const rest = params.rest ? `/${params.rest}` : '';
  throw redirect(308, `/account/tools${rest}${url.search}`);
};
export const HEAD = GET;
export const POST = GET;
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
