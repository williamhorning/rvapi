import openapi from 'npm:openapi-typescript@7.6.1';
import { astToString } from 'npm:openapi-typescript@7.6.1';
import { OpenAPI3 } from 'npm:openapi-typescript@7.6.1';

export async function get_source(schema: OpenAPI3, header: string) {
	const tree = await openapi(schema, {
		emptyObjectsUnknown: true,
	});

	let src = astToString(tree);

	const replacements = [
		[`        parameters: {\n            query?: never;\n            header?: never;\n            path?: never;\n            cookie?: never;\n        };`],
		[`               headers: {\n                    [name: string]: unknown;\n                };`],
		[`        requestBody?: never;\n`],
		[`            query?: never;\n`],
		[`            header?: never;\n`],
		[`            cookie?: never;\n`],
		[`            path?: never;\n`],
		[`                content?: never;\n`, `                content: never;\n`],
		[`*     `, '* '],
		[`T extends any`, `T extends unknown`],
	];

	for (const [search, replace] of replacements) {
		src = src.replaceAll(search, replace || '');
	}

	const methods = [
		'get',
		'put',
		'post',
		'delete',
		'options',
		'head',
		'patch',
		'trace',
	];

	for (const method of methods) {
		src = src.replaceAll(`        ${method}?: never;\n`, '');
	}

	return header + src;
}
