export interface openapi_schema {
	openapi: string;
	paths?: openapi_paths;
	components?: openapi_components;
}

interface openapi_paths {
	[path: string]: openapi_path_item | openapi_reference;
}

export interface openapi_reference {
	$ref: string;
	summary?: string;
	description?: string;
}

export interface openapi_path_item {
	get?: openapi_operation | openapi_reference;
	put?: openapi_operation | openapi_reference;
	post?: openapi_operation | openapi_reference;
	delete?: openapi_operation | openapi_reference;
	options?: openapi_operation | openapi_reference;
	head?: openapi_operation | openapi_reference;
	patch?: openapi_operation | openapi_reference;
	trace?: openapi_operation | openapi_reference;
	parameters?: (openapi_parameter | openapi_reference)[];
}

export interface openapi_operation {
	summary?: string;
	description?: string;
	operationId?: string;
	parameters?: (openapi_parameter | openapi_reference)[];
	requestBody?: openapi_request_body | openapi_reference;
	responses?: openapi_responses;
	deprecated?: boolean;
}

export interface openapi_parameter {
	name: string;
	in: 'query' | 'header' | 'path' | 'cookie';
	description?: string;
	required?: boolean;
	deprecated?: boolean;
	schema?: openapi_schema_object;
	content?: {
		[contentType: string]: openapi_media | openapi_reference;
	};
}

interface openapi_media {
	schema?: openapi_schema_object | openapi_reference;
	encoding?: {
		[propertyName: string]: openapi_encoding;
	};
}

interface openapi_encoding {
	contentType?: string;
	headers?: {
		[name: string]: openapi_header | openapi_reference;
	};
}

type openapi_header = Omit<openapi_parameter, 'name' | 'in'>;

interface openapi_request_body {
	description?: string;
	content: {
		[contentType: string]: openapi_media | openapi_reference;
	};
	required?: boolean;
}

type openapi_responses = {
	[responseCode: string]: openapi_response | openapi_reference;
} & {
	default?: openapi_response | openapi_reference;
};

export interface openapi_response {
	description: string;
	headers?: {
		[name: string]: openapi_header | openapi_reference;
	};
	content?: {
		[contentType: string]: openapi_media;
	};
}

interface openapi_components {
	schemas?: Record<string, openapi_schema_object>;
}

export type openapi_schema_object =
	& {
		title?: string;
		description?: string;
		$comment?: string;
		deprecated?: boolean;
		enum?: unknown[];
		const?: unknown;
		default?: unknown;
		nullable?: boolean;
		additionalProperties?: boolean | openapi_schema_object | openapi_reference;
		oneOf?: (openapi_schema_object | openapi_reference)[];
		allOf?: (openapi_schema_object | openapi_reference)[];
		anyOf?: (openapi_schema_object | openapi_reference)[];
		required?: string[];
	}
	& ({
		type: 'string' | ['string', 'null'];
		enum?: (string | openapi_reference)[];
	} | {
		type: 'number' | ['number', 'null'] | 'integer' | ['integer', 'null'];
		minimum?: number;
		maximum?: number;
		enum?: (number | openapi_reference)[];
	} | {
		type: 'array' | ['array', 'null'];
		items?:
			| openapi_schema_object
			| openapi_reference
			| (openapi_schema_object | openapi_reference)[];
		minItems?: number;
		maxItems?: number;
		enum?: (openapi_schema_object | openapi_reference)[];
	} | {
		type: 'boolean' | ['boolean', 'null'];
		enum?: (boolean | openapi_reference)[];
	} | {
		type: 'null';
	} | {
		type: 'object' | ['object', 'null'];
		properties?: {
			[name: string]: openapi_schema_object | openapi_reference;
		};
		required?: string[];
		allOf?: (openapi_schema_object | openapi_reference)[];
		anyOf?: (openapi_schema_object | openapi_reference)[];
		enum?: (openapi_schema_object | openapi_reference)[];
	});
