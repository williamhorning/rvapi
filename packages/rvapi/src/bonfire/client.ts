import { EventEmitter } from '@denosaurs/event';
import type { ServerMessage } from './server_types.ts';
import type { BonfireEvents, BonfireOptions, ClientMessage } from './types.ts';

/** bonfire is a websocket server that delivers events */
export class Bonfire extends EventEmitter<
	BonfireEvents
> {
	/** the websocket used by the client */
	private socket: WebSocket;

	/** the interval for pinging the server */
	private ping_interval?: number;

	/**
	 * connect to bonfire
	 * @param opts the options for bonfire
	 * @param ws the websocket implementation to use (defaults to the global WebSocket)
	 */
	constructor(opts: BonfireOptions, ws: typeof WebSocket = WebSocket) {
		super();
		const url = new URL(opts.url);
		url.searchParams.set('token', opts.token);
		url.searchParams.set('version', '1');
		this.socket = new ws(url);
		this.socket.onmessage = (event) => {
			this.handle_message(JSON.parse(event.data));
		};
		this.socket.onclose = (event) => {
			if (this.ping_interval) {
				clearInterval(this.ping_interval);
			}
			this.emit('socket_close', { code: event.code, reason: event.reason });
		};
		this.socket.onerror = () => {
			this.emit('socket_error');
		};
		this.socket.onopen = () => {
			this.emit('socket_open');
			this.ping_interval = setInterval(() => this.ping(), 30000);
		};
	}

	/**
	 * handle a message from the server
	 * @param message the message to handle
	 */
	private handle_message(message: ServerMessage) {
		if (message.type === 'Bulk') {
			message.v.forEach((m) => this.handle_message(m));
		}
		// deno-lint-ignore no-explicit-any
		this.emit(message.type, message as any);
	}

	/**
	 * send a message to the server
	 * @param data the message to send
	 */
	send(data: ClientMessage) {
		if (this.socket.readyState !== WebSocket.OPEN) return;
		this.socket.send(JSON.stringify(data));
	}

	/**
	 * authenticate against bonfire
	 * @param token the token to use when authenticating
	 */
	authenticate(token: string) {
		this.send({ type: 'Authenticate', token });
	}

	/**
	 * begin typing in a channel
	 * @param channel the channel to type in
	 */
	beginTyping(channel: string) {
		this.send({ type: 'BeginTyping', channel });
	}

	/**
	 * stop typing in a channel
	 * @param channel the channel to stop typing in
	 */
	endTyping(channel: string) {
		this.send({ type: 'EndTyping', channel });
	}

	/**
	 * ping the server
	 * @param data the timestamp to pass
	 */
	ping(data?: number) {
		this.send({ type: 'Ping', data });
	}
}
