import {
	OpenAPI3,
	PathItemObject,
	ReferenceObject,
} from 'npm:openapi-typescript@7.6.1';

export function get_path_and_query(jsonschema: OpenAPI3, header: string) {
	const path_file_entries = [
		header,
		"import type { paths } from './schema.ts';",
		'export type routes = ',
	];

	const paths = jsonschema.paths ? Object.keys(jsonschema.paths) : [];

	const query_data = {} as Record<string, unknown[]>;

	// deno-lint-ignore no-explicit-any
	const path_resolve = {} as Record<number, any>;

	for (const path of paths) {
		const data = jsonschema.paths![path];
		const methods = Object.keys(data);
		const template = path.replace(/\{\w+\}/g, '${string}');
		for (const method of methods) {
			const operation = `paths['${path}']['${method}']`;
			const route = data[method as keyof (PathItemObject | ReferenceObject)];
			const response = Object.keys(route['responses']).find((x) =>
				x !== 'default'
			) || 'default';
			const content_type =
				Object.keys(route['responses'][response]['content'] || {})[0];
			const response_type = response === '204' || !content_type
				? 'undefined'
				: `${operation}['responses']['${response}']['content']['${content_type}']`;
			const query_parameters = [];
			let has_body = false;
			if (route['parameters']) {
				for (const parameter of route['parameters']) {
					if (parameter.in === 'query') {
						query_parameters.push(parameter.name);
					}
				}
			}
			if (route['requestBody']?.['content']?.['application/json']) {
				has_body = true;
			}
			let parameters = 'undefined';
			if (has_body || query_parameters.length > 0) {
				const entries = [];
				if (query_parameters.length > 0) {
					entries.push(`${operation}['parameters']['query']`);
				}
				if (has_body) {
					entries.push(
						`${operation}['requestBody']['content']['application/json']`,
					);
				}
				parameters = entries.join('|');
			}
			const parts = path.split('').filter((x) => x === '/').length;
			path_file_entries.push(
				`| { method: '${method}', path: \`${template}\`, parts: ${parts}, params: ${parameters}, response: ${response_type} }`,
			);
			if (/\{\w+\}/.test(path)) {
				path_file_entries.push(
					`| { method: '${method}', path: '-${path}', parts: ${parts}, params: ${parameters}, response: ${response_type} }`,
				);
			}
			query_data[path] = {
				...query_data[path],
				[method]: query_parameters,
			};
		}

		const segments = path.split('/');
		segments.shift();
		path_resolve[segments.length] = [
			...(path_resolve[segments.length] || []),
			segments.map((key) => /\{.*\}/.test(key) ? [key] : key),
		];
	}

	return { path_resolve, query_data, path_file_entries };
}
