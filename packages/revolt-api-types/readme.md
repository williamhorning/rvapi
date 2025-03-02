![RVAPI](https://raw.githubusercontent.com/williamhorning/rvapi/main/assets/logo.svg)

# @jersey/revolt-api-types

revolt-api-types is a package providing types for the
[Revolt](https://revolt.chat) protocol. currently, we provide types for Revolt
0.8.x

## usage

you can use the types in this package by doing the following;

```ts
import type { DataMessageSend } from 'jsr:@jersey/revolt-api-types';

let message: DataMessageSend = {
	embeds: [{
		title: 'this is an embed',
		description: 'description here',
		// 'color' does not exist in type DataMessageSend. Did you mean to write 'colour'?
		color: '#000000',
	}],
};
```
