/** types of embeds supported by the revolt api */
export const embed_types = [
	'Bandcamp',
	'GIF',
	'Image',
	'Lightspeed',
	'None',
	'Soundcloud',
	'Spotify',
	'Streamable',
	'Text',
	'Twitch',
	'Video',
	'Website',
	'YouTube',
] as const;

/** options when downloading images */
export interface download_options {
	/** resize width */
	width?: number;
	/** resize height */
	height?: number;
}

/** an error with a request to january or autumn */
export class MediaError extends Error {
	/** the cause of the error from the api */
	override cause: string;

	/** create an error */
	constructor(action: string, cause: string) {
		super(`Failed to ${action}: ${cause}`);
		this.name = 'MediaError';
		this.cause = cause;
	}
}
