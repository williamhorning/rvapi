// deno-lint-ignore no-external-import
import { argv, exit } from 'node:process';
import { parseArgs } from '@std/cli/parse-args';
// deno-lint-ignore no-external-import
import { copyFile, writeFile } from 'node:fs/promises';
import { generate_paths } from './paths.ts';
import { generate_types } from './schema.ts';
import type { openapi_schema } from './types.ts';

const args = parseArgs(argv.splice(2), {
	string: ['dest', 'url'],
	boolean: ['skip_requests', 'skip_routes'],
	default: {
		dest: '.',
		skip_routes: false,
		skip_requests: false,
	},
});

if (!args.url) {
	console.error('%cYou must supply a url! Use the `--url` flag.', 'color: red');
	exit(1);
}

console.info('%cGenerating code for %s', 'color: blue', args.url);

const schema = await (await fetch(args.url)).json() as openapi_schema;

if (!schema.components?.schemas) {
	console.error('%cNo components found in the OpenAPI schema.', 'color: red');
	exit(1);
}

if (!schema.paths) {
	console.error('%cNo paths found in the OpenAPI schema.', 'color: red');
	exit(1);
}

const seen_operations = new Set<string>();

for (const key of Object.keys(schema.paths)) {
	if ('$ref' in schema.paths[key]) continue;

	for (const method of Object.keys(schema.paths[key])) {
		const item = schema.paths[key][method as 'get'];
		if (!item) continue;
		if ('$ref' in item) continue;

		if (!item.operationId) continue;

		if (seen_operations.has(item.operationId)) {
			item.operationId = `${item.operationId}_${key.split('/')[1]}`;
			schema.paths[key][method as 'get'] = item;
		} else {
			seen_operations.add(item.operationId);
		}
	}
}

let types_file = generate_types(schema.components.schemas);

if (!args.skip_routes) {
	const paths = generate_paths(schema.paths);
	await writeFile(`${args.dest}/params.ts`, paths.params, 'utf-8');
	await writeFile(`${args.dest}/routes.ts`, paths.routes, 'utf-8');
	types_file += paths.operations;
}

await writeFile(`${args.dest}/schema.ts`, types_file, 'utf-8');

if (!args.skip_requests) {
	await copyFile(
		new URL('../gen/mod.txt', import.meta.url),
		`${args.dest}/mod.ts`,
	);
	await copyFile(
		new URL('../gen/request.txt', import.meta.url),
		`${args.dest}/request.ts`,
	);
}
