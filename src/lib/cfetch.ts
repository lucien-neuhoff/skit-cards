export type Fetch = typeof fetch;

export const cfetch = async <T>(
	url: string,
	method: 'GET' | 'POST' | 'UPDATE' | 'DELETE' | 'PUT',
	fetch: Fetch,
	options?: RequestInit
): Promise<{
	data: T | null;
	error: string;
	status: number;
	statusText: string;
}> => {
	const res = await fetch(url, { method, ...options });

	if (!res.ok) {
		let error;
		try {
			const data = await res.json();
			error = data.error.message;
		} catch (e) {
			/* empty */
		}

		return {
			data: null,
			error: `[${res.status}] <${method}> '${url}'${error ? ' => ' + error : ''}`,
			status: res.status,
			statusText: res.statusText
		};
	}

	if (res.status == 200 || res.status == 201)
		try {
			const { data, error } = await res.json();
			return { data, error, status: res.status, statusText: res.statusText };
		} catch (e) {
			/* empty */
		}

	return { data: null, error: '', status: res.status, statusText: res.statusText };
};

export type CFetch = typeof cfetch;
