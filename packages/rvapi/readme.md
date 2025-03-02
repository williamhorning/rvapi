![RVAPI](https://raw.githubusercontent.com/williamhorning/rvapi/main/assets/logo.svg)

# RVAPI - _A Typescript library for the Revolt API_

## Example

```ts
import { createClient } from 'jsr:@jersey/rvapi';

const client = createClient({
	token: '<insert token>',
});

client.bonfire.on('Message', console.log);

client.request('post', '/channels/{channel}/messages', { content: 'hello' });
```
