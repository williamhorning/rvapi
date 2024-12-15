import type { routes } from '@jersey/revolt-api-types';

/**
 * make a request against the revolt api
 */
export type request = <
	method extends routes['method'],
	path extends (routes & { method: method })['path'],
	route extends (routes & { method: method; path: path }),
>(
	method: method,
	path: path,
	params: route['params'],
) => Promise<Exclude<route['response'], string>>;

/** an error with a request to the api */
export class RequestError extends Error {
	/** the cause of the error from the api */
	override cause: Response;
	method: string;
	path: string;
	params: unknown;

	/** create an error */
	constructor(method: string, path: string, params: unknown, cause: Response) {
		super(`Failed to ${method} ${path}: ${cause.status}`);
		this.name = 'RequestError';
		this.cause = cause;
		this.method = method;
		this.path = path;
		this.params = params;
	}
}
