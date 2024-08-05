import type { ServerMessage } from "./server_types.ts";

/** the events emitted by bonfire */
export type BonfireEvents = {
  socket_close: [{ code: number; reason: string }];
  socket_error: [];
  socket_open: [];
} & {
  [K in ServerMessage["type"]]: [ServerMessage & { type: K }];
};

/** the options for bonfire */
export interface BonfireOptions {
  /** the url of the server */
  url: string;
  /** the token to authenticate with */
  token: string;
}

/** messages that can be sent by a client */
export type ClientMessage = {
  type: "Authenticate";
  token: string;
} | {
  type: "BeginTyping" | "EndTyping";
  channel: string;
} | {
  type: "Ping";
  data?: number;
};
