import { queryParams } from "./generated/params.ts";
import type { routes } from "./generated/routes.ts";
import { path_name } from "./path_name.ts";

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

    if (named && params && typeof params === "object") {
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

    const req_body = ["head", "get"].includes(method)
      ? undefined
      : JSON.stringify(body);

    const res = await fetch(`${base_url}${path}?${query.toString()}`, {
      method,
      headers,
      body: req_body,
    });

    if (res.ok) {
      return await res.json();
    } else {
      throw new Error(`Request failed with status ${res.status}`, {
        cause: await res.text(),
      });
    }
  };
}

/**
 * make a request against the revolt api
 */
export type request = <
  method extends routes["method"],
  path extends (routes & { method: method })["path"],
  route extends (routes & { method: method; path: path }),
>(
  method: method,
  path: path,
  params: route["params"],
) => Promise<Exclude<route["response"], string>>;
