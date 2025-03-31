import { path_name } from './path_name.ts';
import { queryParams } from './params.ts';
import type { routes } from './routes.ts';

/**
 * Create a request function
 * @param base_url The base URL to use
 * @param headers The headers to use
 * @returns A request function
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

/**
 * The type of the request function.
 */
export type request = <
	method extends routes['method'],
	path extends Extract<routes, { method: method }>['path'],
	params extends Extract<routes, { method: method; path: path }>['params'],
	response extends Exclude<
		Extract<routes, { method: method; path: path }>['response'],
		string
	>,
>(
	method: method,
	path: path,
	params: params,
) => Promise<response>;

/** An error with a request to the API */
export class RequestError extends Error {
	/** The cause of the error from the API */
	override cause: Response;
	method: string;
	path: string;
	params: unknown;

	/** Create an error */
	constructor(method: string, path: string, params: unknown, cause: Response) {
		super(`Failed to ${method} ${path}: ${cause.status}`);
		this.name = 'RequestError';
		this.cause = cause;
		this.method = method;
		this.path = path;
		this.params = params;
	}
}
