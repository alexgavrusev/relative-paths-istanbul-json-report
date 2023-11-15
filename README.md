# relative-paths-istanbul-json-report

An [Istanbul](https://istanbul.js.org) reporter whose output is like that of the built-in [`json`](https://istanbul.js.org/docs/advanced/alternative-reporters/#json) reporter, with one added feature - **support for `projectRoot`**

## Rationale

In the context of a monorepo, it may be useful to get a merged coverage report.

But, in a CI pipeline, or with distributed task execution, testing tasks may be run on different machines, resulting in reports that cannot be merged, because of different absolute paths to the checked out repository

Thus, the **`projectRoot` should be set to the monorepo root**

## Installation

```bash
npm i -D relative-paths-istanbul-json-report
```

## Usage with [Jest](https://jestjs.io)

Add the reporter to [`coverageReporters`](https://jestjs.io/docs/configuration#coveragereporters-arraystring--string-options)

```ts
// workspace-level jest.config.ts
/** @type {import('jest').Config} */
const config = {
  coverageReporters: [['relative-paths-istanbul-json-report', { projectRoot: monorepoRoot }]],
};

module.exports = config;
```

## Usage with [Vitest](https://vitest.dev)

Add the reporter to [`coverage.reporter`](https://vitest.dev/config/#coverage-reporter)

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: [
        // @ts-expect-error types assume only builtin istanbul reporters will be used, see https://github.com/vitest-dev/vitest/issues/4150
        ['relative-paths-istanbul-json-report', { projectRoot: monorepoRoot }],
      ],
    },
  },
});
```

## Building

Run `nx build relative-paths-istanbul-json-report` to build the library.

## Running unit tests

Run `nx test relative-paths-istanbul-json-report` to execute the unit tests.

## License

MIT © Aliaksandr Haurusiou.
