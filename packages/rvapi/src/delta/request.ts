import { queryParams } from '@jersey/revolt-api-types';
import { path_name } from './path_name.ts';
import { type request, RequestError } from './types.ts';

/**
 * create a request function
 * @param base_url the base url to use
 * @param headers the headers to use
 * @returns a request function
 */
export function createRequest(
	base_url: string,
	headers: Record<string, string>,
): request {
	return async (method, path, params) => {
		const query = new URLSearchParams();
		const body = {} as Record<string, unknown>;
		const named = path_name(path);

		if (named && params && typeof params === 'object') {
			const route = queryParams[named as keyof typeof queryParams];
			const allowed_query = (route as Record<typeof method, string[]>)[method];
			for (const param of Object.keys(params)) {
				if (allowed_query.includes(param)) {
					query.append(param, (params as Record<string, string>)[param]);
				} else {
					body[param] = (params as Record<string, string>)[param];
				}
			}
		}

		const req_body = ['head', 'get', 'HEAD', 'GET'].includes(method)
			? undefined
			: JSON.stringify(body);

		const query_string = query.size ? `?${query.toString()}` : '';

		const res = await fetch(`${base_url}${path}${query_string}`, {
			method,
			headers,
			body: req_body,
		});

		if (res.ok) {
			try {
				return await res.json();
			} catch (e) {
				throw e;
			}
		} else {
			throw new RequestError(method, path, params, res);
		}
	};
}
