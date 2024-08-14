![RVAPI](https://raw.githubusercontent.com/williamhorning/rvapi/main/assets/logo.svg)

# @jersey/revolt-api-types

revolt-api-types is a package providing types for the
[Revolt](https://revolt.chat) protocol. this is used by
[rvapi](https://jsr.io/@jersey/rvapi) for providing up-to-date types and openapi
codegen.

## usage

you can use the types in this package by doing the following;

```ts
import type { DataMessageSend } from '@jersey/revolt-api-types';

let message: DataMessageSend = {
	embeds: [{
		title: 'this is an embed',
		description: 'description here',
		// 'color' does not exist in type DataMessageSend. Did you mean to write 'colour'?
		color: '#000000',
	}],
};
```
