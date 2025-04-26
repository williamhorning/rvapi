import type { Feature, request } from '@jersey/revolt-api-types';
import { createRequest } from '@jersey/revolt-api-types';
import { Bonfire } from './bonfire/client.ts';
import { MediaServices } from './media/mod.ts';

/** options used by the clients */
export interface ClientOptions {
	/**
	 * the api url to use
	 * @default 'https://api.revolt.chat'
	 */
	api_url?: string;
	/**
	 * extra headers to use for the api
	 * @default {}
	 */
	api_headers?: Record<string, string>;
	/**
	 * the configuration to use for autumn
	 * @default { enabled: true, url: 'https://cdn.revoltusercontent.com' }
	 */
	autumn?: Feature;
	/**
	 * the configuration to use for january
	 * @default { enabled: true, url: 'https://jan.revolt.chat' }
	 */
	january?: Feature;
	/**
	 * the token to use for authentication against the api (required)
	 */
	token: string;
	/**
	 * the websocket url to use
	 * @default 'wss://ws.revolt.chat'
	 */
	ws_url?: string;
}

/** a client for the revolt api */
export interface Client {
	/** access to events */
	bonfire: Bonfire;
	/** access to media services */
	media: MediaServices;
	/** make a request against the api */
	request: request;
}

/**
 * create a client to interact with the revolt api
 * @param opts the options to use for the client
 */
export function createClient(opts: ClientOptions): Client {
	return {
		bonfire: new Bonfire({
			url: opts.ws_url || 'wss://ws.revolt.chat',
			token: opts.token,
		}),
		media: new MediaServices(
			opts.january || {
				enabled: true,
				url: 'https://jan.revolt.chat',
			},
			opts.autumn || {
				enabled: true,
				url: 'https://cdn.revoltusercontent.com',
			},
			opts.token,
		),
		request: createRequest(opts.api_url || 'https://api.revolt.chat/0.8', {
			'X-Bot-Token': opts.token,
			...opts.api_headers,
		}),
	};
}
