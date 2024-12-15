import type { Embed, Feature } from '@jersey/revolt-api-types';
import { type download_options, embed_types, MediaError } from './types.ts';

/** a way to interact with january and autumn */
export class MediaServices {
	/** january config */
	private january: Feature;
	/** autumn config */
	private autumn: Feature;

	/** create an instance of MediaServices */
	constructor(january: Feature, autumn: Feature) {
		this.january = january;
		this.autumn = autumn;
	}

	/**
	 * get an embed for a website
	 * @param url the url to get an embed for
	 * @returns the generated embed for the url
	 */
	async get_embed(url: string): Promise<Embed> {
		if (!this.january.enabled) {
			throw new MediaError('get embed', 'JanuaryDisabled');
		}
		const embed = await (await fetch(
			`https://${this.january.url}/embed?url=${encodeURIComponent(url)}`,
		)).json();
		if (!embed_types.includes(embed.type)) {
			throw new MediaError('get embed', embed.type);
		}
		return embed;
	}

	/**
	 * get a proxy url
	 * @param url the url to get a proxy url for
	 * @returns a proxy url for the given url, if it can be proxied
	 */
	async get_proxy(url: string): Promise<string> {
		if (!this.january.enabled) {
			throw new MediaError('get proxy', 'JanuaryDisabled');
		}
		const proxy_url = `https://${this.january.url}/proxy?url=${
			encodeURIComponent(url)
		}`;
		const resp = await fetch(proxy_url);
		if (!resp.ok || resp.headers.get('Content-Type') === 'application/json') {
			throw new MediaError('get proxy', (await resp.json()).type);
		}
		return proxy_url;
	}

	/**
	 * download a file from autumn
	 * @param tag the tag to use (like attachments)
	 * @param id the id of the file
	 * @param options options for the file
	 * @returns the blob of the requested file
	 */
	async download_file(
		tag: string,
		id: string,
		options?: download_options,
	): Promise<Blob> {
		if (!this.autumn.enabled) {
			throw new MediaError('download file', 'AutumnDisabled');
		}
		const download_url = new URL(
			`/${tag}/download/${id}`,
			this.autumn.url,
		);

		if (options?.height) {
			download_url.searchParams.set('height', options.height.toString());
		}
		if (options?.width) {
			download_url.searchParams.set('width', options.width.toString());
		}

		const resp = await fetch(download_url);

		if (!resp.ok) {
			throw new MediaError('download file', (await resp.json()).type);
		}

		return await resp.blob();
	}

	/**
	 * upload a file to autumn
	 * @param tag the tag to use (like attachments)
	 * @param file the file to upload
	 * @returns the id of the uploaded file
	 */
	async upload_file(tag: string, file: Blob): Promise<string> {
		if (!this.autumn.enabled) {
			throw new MediaError('upload file', 'AutumnDisabled');
		}

		const form = new FormData();
		form.append('file', file);

		const resp = await fetch(`${this.autumn.url}/${tag}`, {
			method: 'POST',
			body: form,
		});

		const data = await resp.json();

		if (!resp.ok || data.type) {
			throw new MediaError('upload file', data.type);
		}

		return data.id;
	}
}
