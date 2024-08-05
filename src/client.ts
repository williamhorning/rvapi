import { Bonfire } from "./bonfire/client.ts";
import { MediaServices } from "./media/mod.ts";
import { createRequest, type request } from "./delta/request.ts";
import type { Feature } from "./delta/generated/types.ts";

/** options used by the clients */
export interface ClientOptions {
  /**
   * the api url to use,
   * this defaults to https://api.revolt.chat
   */
  api_url?: string;
  /**
   * extra headers to use for the api
   */
  api_headers?: Record<string, string>;
  /**
   * the configuration to use for autumn,
   * defaults to https://autumn.revolt.chat
   */
  autumn?: Feature;
  /**
   * the configuration to use for january,
   * defaults to https://jan.revolt.chat
   */
  january?: Feature;
  /**
   * the token to use for authentication against the api
   */
  token: string;
  /**
   * the websocket url to use,
   * defaults to wss://ws.revolt.chat
   */
  ws_url?: string;
}

/** a client for the revolt api */
export interface Client {
  /** access to events */
  bonfire: Bonfire;
  /** access to media services */
  media: MediaServices;
  /** the options used by the client */
  opts: ClientOptions;
  /** make a request against the api */
  request: request;
}

/**
 * create a client to interact with the revolt api
 * @param opts the options to use for the client
 */
export function createClient(opts: ClientOptions): Client {
  const client = {
    bonfire: new Bonfire({
      url: opts.ws_url || "wss://ws.revolt.chat",
      token: opts.token,
    }),
    media: new MediaServices(
      opts.january || {
        enabled: true,
        url: "https://jan.revolt.chat",
      },
      opts.autumn || {
        enabled: true,
        url: "https://autumn.revolt.chat",
      },
    ),
    opts,
    request: createRequest(opts.api_url || "https://api.revolt.chat", {
      "X-Bot-Token": opts.token,
      ...opts.api_headers,
    })
  };
  setInterval(() => client.bonfire.ping(), 30000);
  return client;
}
