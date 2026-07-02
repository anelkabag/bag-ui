# dprint - JS Formatter

[![CI](https://github.com/dprint/js-formatter/workflows/CI/badge.svg)](https://github.com/dprint/js-formatter/actions?query=workflow%3ACI)
[![npm version](https://badge.fury.io/js/%40dprint%2Fformatter.svg)](https://badge.fury.io/js/%40dprint%2Fformatter)
[![JSR](https://jsr.io/badges/@dprint/formatter)](https://jsr.io/@dprint/formatter)

JS formatter for dprint Wasm plugins.

## Setup

Deno:

```sh
deno add @dprint/formatter
```

Node.js:

```sh
npm i @dprint/formatter
```

## Use

```ts
import { createStreaming, GlobalConfiguration } from "@dprint/formatter";

const globalConfig: GlobalConfiguration = {
  indentWidth: 2,
  lineWidth: 80,
};
const tsFormatter = await createStreaming(
  // check https://plugins.dprint.dev/ for latest plugin versions
  fetch("https://plugins.dprint.dev/typescript-0.57.0.wasm"),
);

tsFormatter.setConfig(globalConfig, {
  semiColons: "asi",
});

// outputs: "const t = 5\n"
console.log(tsFormatter.formatText("file.ts", "const   t    = 5;"));
```

Using with plugins on npm (ex. [@dprint/json](https://www.npmjs.com/package/@dprint/json)):

```ts
import { createFromBuffer } from "@dprint/formatter";
// You may have to use `getBuffer` on plugins that haven't updated yet.
// See the plugins README.md for details.
import { getPath } from "@dprint/json";
import * as fs from "node:fs";

const buffer = fs.readFileSync(getPath());
const formatter = createFromBuffer(buffer);

console.log(formatter.formatText("test.json", "{test: 5}"));
```

### Plugin NPM Packages

Note: In the future I will ensure plugins are published to JSR as well.

- [@dprint/json](https://www.npmjs.com/package/@dprint/json)
- [@dprint/typescript](https://www.npmjs.com/package/@dprint/typescript)
- [@dprint/markdown](https://www.npmjs.com/package/@dprint/markdown)
- [@dprint/toml](https://www.npmjs.com/package/@dprint/toml)
- [@dprint/dockerfile](https://www.npmjs.com/package/@dprint/dockerfile)
- [@dprint/biome](https://www.npmjs.com/package/@dprint/biome)
- [@dprint/ruff](https://www.npmjs.com/package/@dprint/ruff)
