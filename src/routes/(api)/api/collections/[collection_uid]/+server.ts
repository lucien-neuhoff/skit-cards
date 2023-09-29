import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params: { collection_uid }, locals: { supabase } }) => {
	if (!collection_uid || collection_uid.length !== 21) return new Response(null, { status: 422 });

	const query = supabase
		.from('cards_collections')
		.select('uid, author:profiles(name:name, uid:uid), name, is_public, created_at')
		.match({ uid: collection_uid });

	const { data, error, status }: DbResult<typeof query> = await query;

	if (error) return new Response(null, { status: 500 });

	if (!data || !(data.length > 0)) return new Response(null, { status: 204 });

	console.log(data);

	if (!data[0].author)
		return new Response(JSON.stringify({ error: 'Could not find author' }), { status: 404 });

	if ((data[0] as TCollection | null)?.author === null)
		return new Response(
			JSON.stringify({
				data
			}),
			{ status }
		);

	return new Response(null, { status });
};
