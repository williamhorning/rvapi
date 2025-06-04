# @jersey/openapi

openapi is a package that provides opinionated OpenAPI codegen

## usage

```sh
deno run -A @jersey/openapi --url https://api.revolt.chat/openapi.json --dest ./src
```

## options

| name              | description                                         | required | default |
| ----------------- | --------------------------------------------------- | -------- | ------- |
| url               | the location of the OpenAPI schema (in JSON format) | true     | N/A     |
| dest              | the destination folder for generated files          | false    | `./`    |
| include_responses | whether to generate response component related code | false    | `false` |
| skip_routes       | whether to generate route-related code              | false    | `false` |
| skip_requests     | whether to generate request-related code            | false    | `false` |
