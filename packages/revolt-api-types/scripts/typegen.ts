// deno-lint-ignore no-external-import
import { get_path_and_query } from './get_path_and_query.ts';
import { get_source } from './get_source.ts';

const header = '// this file was autogenerated by scripts/typegen.ts\n\n';
const schema_url = 'https://api.revolt.chat/openapi.json';
const jsonschema = await (await fetch(schema_url)).json();

// handle duplicate operationIds (technically against the spec)
const seen_operations = new Set<string>();

for (const key of Object.keys(jsonschema.paths)) {
	for (const method of Object.keys(jsonschema.paths[key])) {
		if (seen_operations.has(jsonschema.paths[key][method].operationId)) {
			jsonschema.paths[key][method].operationId = `${
				jsonschema.paths[key][method].operationId
			}_${key.split('/')[1]}`;
		}

		seen_operations.add(jsonschema.paths[key][method].operationId);
	}
}

let src = await get_source(jsonschema, header);

Deno.writeTextFileSync(new URL('../src/schema.ts', import.meta.url), src);

const {
	path_resolve,
	query_data,
	path_file_entries,
} = get_path_and_query(jsonschema, header);

Deno.writeTextFileSync(
	new URL('../src/routes.ts', import.meta.url),
	path_file_entries.join('\n') + ';',
);

Deno.writeTextFileSync(
	new URL('../src/params.ts', import.meta.url),
	`${header}export const pathResolve = ${
		JSON.stringify(path_resolve)
	};\nexport const queryParams = ${JSON.stringify(query_data)};`,
);

const type_entries = [
	header,
	"import type { components } from './schema.ts';",
];

for (const schema of Object.keys(jsonschema.components.schemas)) {
	type_entries.push(`export type ${
		schema.replace(
			/\s/g,
			'_',
		)
	} = components['schemas']['${schema}'];`);
}

Deno.writeTextFileSync(
	new URL('../src/types.ts', import.meta.url),
	type_entries.join('\n'),
);
