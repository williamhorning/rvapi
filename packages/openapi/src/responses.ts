// given a response object, return a typescript type string (like done in schema.ts) for the response body
import type { openapi_response } from './types.ts';
import { handle_schema } from './schema.ts';

export function get_response_type(
	responses: Record<string, openapi_response>,
): string {
	let response_file = `\n`;
	let response_interface = `export interface responses {\n`;

	for (const response in responses) {
		const res = responses[response];

		if (!res.content || Object.keys(res.content).length === 0) continue;

		const response_object = res.content[Object.keys(res.content)[0]].schema;

		if (!response_object || '$ref' in response_object) continue;

		response_file += handle_schema(
			response,
			response_object,
		);

		response_interface += `\t${response}: ${response};\n`;
	}

	response_file += response_interface + `}\n\n`;

	return response_file;
}
