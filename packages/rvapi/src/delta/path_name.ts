import { pathResolve } from '@jersey/revolt-api-types';

export function path_name(path: string) {
	const segments = path.split('/');

	const list =
		(pathResolve as unknown as Record<string, (string | [string])[]>)[
			(segments.length - 1).toString()
		] || [];
	for (const entry of list) {
		let i = 1;
		const copy = [...segments];
		for (i; i < segments.length; i++) {
			if (Array.isArray(entry[i - 1])) {
				copy[i] = entry[i - 1];
				continue;
			} else if (entry[i - 1] !== segments[i]) break;
		}

		if (i === segments.length) return copy.join('/');
	}
}
