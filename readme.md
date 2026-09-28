# @stackline/unified-engine

> Process files with unified plugins, configuration, and ignore rules using the unified-engine 10 callback API.

[![npm version](https://img.shields.io/npm/v/@stackline/unified-engine.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/unified-engine)
[![license](https://img.shields.io/npm/l/@stackline/unified-engine.svg?style=flat-square)](https://github.com/alexandroit/stackline-unified-engine/blob/main/license)
[![GitHub repository](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-unified-engine)

**[Documentation](https://github.com/alexandroit/stackline-unified-engine#readme)** |
**[npm](https://www.npmjs.com/package/@stackline/unified-engine)** |
**[Issues](https://github.com/alexandroit/stackline-unified-engine/issues)** |
**[Repository](https://github.com/alexandroit/stackline-unified-engine)**

**Package version:** `1.0.1`

## Why this package?

Maintained MIT-licensed fork of `unified-engine@10.1.0`, retaining its callback API and unified 10 / vfile 5 type model. Requires Node.js 20.19+ on the 20.x line, or Node.js 22.12+.

The file finder uses glob 13 with brace-aware magic detection and a Promise-to-callback bridge. `@stackline/load-plugin` removes obsolete glob/inflight dependencies from the plugin-resolution path while preserving the original options.

Development: `npm ci`, `npm run build`, `npm test`, `npm run lint`. `npm run build` validates the preserved published declarations with modern TypeScript; it does not regenerate unrelated legacy JSDoc. See [UPSTREAM-TYPES.md](https://github.com/alexandroit/stackline-unified-engine/blob/main/UPSTREAM-TYPES.md). Tests include the upstream integration suite and focused glob regressions.

**[unified][]** engine to process multiple files, lettings users [configure][]
from the file system.

### What is this?

This package is the engine.
It’s what you use underneath when you use [`remark-cli`][remark-cli] or a
language server.
Compared to unified, this deals with multiple files, often from the file
system, and with configuration files and ignore files.

### When should I use this?

You typically use something that wraps this, such as:

*   [`unified-args`][args]
    — create CLIs
*   [`unified-engine-gulp`][gulp]
    — create Gulp plugins
*   [`unified-language-server`][language-server]
    — create language servers

You can use this to make such things.

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/unified-engine@1.0.1` |
| Supported Node.js | `^20.19.0 || >=22.12.0` |
| Module entry | `index.js` (ES modules) |
| Runtime dependencies | 22 direct dependencies |
| Types | `index.d.ts` |

This fork supports Node.js 20.19+ on the 20.x line, and Node.js 22.12+.
The callback API and unified 10 / vfile 5 type model are preserved.

## Installation

```bash
npm install @stackline/unified-engine
```

<a id="install"></a>

This package is [ESM only][esm].
In Node.js (20.19+ on the 20.x line, or 22.12+), install with [npm][]:

```sh
npm install @stackline/unified-engine
```

## Usage

<a id="use"></a>

The following example processes all files in the current directory with a
markdown extension with **[remark][]**, allows [configuration][configure]
from `.remarkrc` and `package.json` files, ignoring files from `.remarkignore`
files, and more.

```js
/**
 * @typedef {import('unified-engine').Callback} Callback
 */

import {engine} from '@stackline/unified-engine'
import {remark} from 'remark'

engine(
  {
    processor: remark,
    files: ['.'],
    extensions: ['md', 'markdown', 'mkd', 'mkdn', 'mkdown'],
    pluginPrefix: 'remark',
    rcName: '.remarkrc',
    packageField: 'remarkConfig',
    ignoreName: '.remarkignore',
    color: true
  },
  done
)

/** @type {Callback} */
function done(error) {
  if (error) throw error
}
```

## Security

Plugins and JavaScript configuration can execute code. Review the existing security guidance before processing an untrusted project.

`unified-engine` loads and evaluates configuration files, plugins, and presets
from the file system (often from `node_modules/`).
That means code that is on your file system runs.
Make sure you trust the workspace where you run `unified-engine` and be careful
with packages from npm and changes made by contributors.

## API Surface

<a id="api"></a>

This package exports the identifier `engine`.
There is no default export.

### `engine(options, callback)`

Process files according to `options` and call [`callback`][callback] when
done.

###### [`options`][options]

*   [`processor`][processor] ([`Processor`][unified-processor])
    — unified processor to transform files
*   [`cwd`][cwd] (`string` or `URL`, default: `process.cwd()`)
    — directory to search files in, load plugins from, and more
*   [`files`][files] (`Array<string|URL|VFile>`, optional)
    — paths or globs to files and directories, virtual files, or URLs, to
    process
*   [`extensions`][extensions] (`Array<string>`, optional)
    — if `files` matches directories, include files with `extensions`
*   [`streamIn`][stream-in] (`ReadableStream`, default: `process.stdin`)
    — stream to read from if no files are found or given
*   [`filePath`][file-path] (`string`, optional)
    — file path to process the given file on `streamIn` as
*   [`streamOut`][stream-out] (`WritableStream`, default: `process.stdout`)
    — stream to write processed files to
*   [`streamError`][stream-error] (`WritableStream`, default: `process.stderr`)
    — stream to write the report (if any) to
*   [`out`][out] (`boolean`, default: depends)
    — whether to write the processed file to `streamOut`
*   [`output`][output] (`boolean` or `string`, default: `false`)
    — whether to write successfully processed files, and where to
*   [`alwaysStringify`][always-stringify] (`boolean`, default: `false`)
    — whether to always serialize successfully processed files
*   [`tree`][tree] (`boolean`, default: `false`)
    — whether to treat both input and output as a syntax tree
*   [`treeIn`][tree-in] (`boolean`, default: `tree`)
    — whether to treat input as a syntax tree
*   [`treeOut`][tree-out] (`boolean`, default: `tree`)
    — whether to treat output as a syntax tree
*   [`inspect`][inspect] (`boolean`, default: `false`)
    — whether to output a formatted syntax tree
*   [`rcName`][rc-name] (`string`, optional)
    — name of configuration files to load
*   [`packageField`][package-field] (`string`, optional)
    — property at which configuration can be found in `package.json` files
*   [`detectConfig`][detect-config] (`boolean`, default: whether `rcName` or
    `packageField` is given)
    — whether to search for configuration files
*   [`rcPath`][rc-path] (`string`, optional)
    — filepath to a configuration file to load
*   [`settings`][settings] (`Object`, optional)
    — configuration for the parser and compiler of the processor
*   [`ignoreName`][ignore-name] (`string`, optional)
    — name of ignore files to load
*   [`detectIgnore`][detect-ignore] (`boolean`, default: whether `ignoreName`
    is given)
    — whether to search for ignore files
*   [`ignorePath`][ignore-path] (`string`, optional)
    — filepath to an ignore file to load
*   [`ignorePathResolveFrom`][ignore-path-resolve-from] (`'dir'` or `'cwd'`,
    default: `'dir'`)
    — resolve patterns in `ignorePath` from the current working directory or the
    file’s directory
*   [`ignorePatterns`][ignore-patterns] (`Array<string>`, optional)
    — patterns to ignore in addition to ignore files, if any
*   [`ignoreUnconfigured`][ignore-unconfigured] (`boolean`, default: `false`)
    — ignore files that do not have an associated detected configuration file
*   [`silentlyIgnore`][silently-ignore] (`boolean`, default: `false`)
    — skip given files if they are ignored
*   [`plugins`][options-plugins] (`Array|Object`, optional)
    — plugins to use
*   [`pluginPrefix`][plugin-prefix] (`string`, optional)
    — optional prefix to use when searching for plugins
*   [`configTransform`][config-transform] (`Function`, optional)
    — transform config files from a different schema
*   [`reporter`][reporter] (`string` or `function`, default:
    `import {reporter} from 'vfile-reporter'`)
    — reporter to use
*   [`reporterOptions`][reporteroptions] (`Object?`, optional)
    — config to pass to the used reporter
*   [`color`][color] (`boolean`, default: `false`)
    — whether to report with ANSI color sequences
*   [`silent`][silent] (`boolean`, default: `false`)
    — report only fatal errors
*   [`quiet`][quiet] (`boolean`, default: `silent`)
    — do not report successful files
*   [`frail`][frail] (`boolean`, default: `false`)
    — call back with an unsuccessful (`1`) code on warnings as well as errors

#### `function callback(error[, code, context])`

Called when processing is complete, either with a fatal error if processing
went horribly wrong (probably due to incorrect configuration on your part as a
developer), or a status code and the processing context.

###### Parameters

*   `error` (`Error`) — fatal error
*   `code` (`number`) — either `0` if successful, or `1` if unsuccessful,
    the latter occurs if [fatal][] errors happen when processing individual
    files, or if [`frail`][frail] is set and warnings occur
*   `context` (`Object`) — processing context, containing internally used
    information and a `files` array with the processed files

### Plugins

[`doc/plugins.md`][plugins] describes in detail how plugins can add more files
to be processed and handle all transformed files.

### Configuration

[`doc/configure.md`][configure] describes in detail how configuration files
work.

### Ignoring

[`doc/ignore.md`][ignore] describes in detail how ignore files work.

### Types

This package is fully typed with [TypeScript][].
It additionally exports the following types:

*   `VFileReporterOptions` — models options passed to vfile reporters
*   `VFileReporter` — models the signature accepted as a vfile reporter
*   `FileSet` — models what is passed to plugins as a second parameter
*   `Completer` — models file set plugins
*   `ResolveFrom` — models the enum allowed for `options.ignorePathResolveFrom`
*   `ConfigTransform` — models the signature of `options.configTransform`
*   `Preset` — models a preset, like `Preset` from `unified` but accepts
    strings
*   `Options` — models configuration
*   `Context` — models the third parameter to `callback`
*   `Callback` — models the signature of `callback`

## Local Development

Clone the [repository](https://github.com/alexandroit/stackline-unified-engine) and run the following commands from its root:

```bash
npm ci
npm run build
npm test
npm run lint
npm run test:types
```

The retained upstream development notes below include historical tooling; the commands above are the maintained package checks.

### Contribute

See [`contributing.md`][contributing] in [`unifiedjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## Release Checklist

1. Update the package version, lockfile, generated version fields, and changelog together.
2. Run the development checks above and audit both `npm audit` and `npm audit --omit=dev`.
3. Use the [GitHub publish workflow](https://github.com/alexandroit/stackline-unified-engine/actions/workflows/publish.yml) with its `Prod` environment to publish the exact CI tarball.
4. Verify public npm bytes, package identity, provenance, and the immutable GitHub release evidence.

## Community and Support

Report reproducible package issues in the [issue tracker](https://github.com/alexandroit/stackline-unified-engine/issues).

- [Stackline / Alexandro.Net](https://alexandro.net/)
- [GitHub](https://github.com/alexandroit)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)
- [Reddit community: r/Stackline](https://www.reddit.com/r/Stackline/)

## License

[MIT](https://github.com/alexandroit/stackline-unified-engine/blob/main/license). Original copyright notices and upstream attribution are retained.

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/unifiedjs/unified-engine/workflows/main/badge.svg

[build]: https://github.com/unifiedjs/unified-engine/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/unifiedjs/unified-engine.svg

[coverage]: https://codecov.io/github/unifiedjs/unified-engine

[downloads-badge]: https://img.shields.io/npm/dm/unified-engine.svg

[downloads]: https://www.npmjs.com/package/unified-engine

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/unifiedjs/unified/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[typescript]: https://www.typescriptlang.org

[health]: https://github.com/unifiedjs/.github

[contributing]: https://github.com/unifiedjs/.github/blob/main/contributing.md

[support]: https://github.com/unifiedjs/.github/blob/main/support.md

[coc]: https://github.com/unifiedjs/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[unified]: https://github.com/unifiedjs/unified

[unified-processor]: https://github.com/unifiedjs/unified#processor

[remark]: https://github.com/remarkjs/remark

[fatal]: https://github.com/vfile/vfile#vfilefailreason-position-ruleid

[callback]: #function-callbackerror-code-context

[options]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#options

[processor]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsprocessor

[cwd]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionscwd

[extensions]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsextensions

[stream-in]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsstreamin

[file-path]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsfilepath

[stream-out]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsstreamout

[stream-error]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsstreamerror

[out]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsout

[output]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsoutput

[always-stringify]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsalwaysstringify

[tree]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionstree

[tree-in]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionstreein

[tree-out]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionstreeout

[inspect]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsinspect

[detect-config]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsdetectconfig

[rc-name]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsrcname

[package-field]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionspackagefield

[rc-path]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsrcpath

[settings]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionssettings

[detect-ignore]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsdetectignore

[ignore-name]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsignorename

[ignore-path]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsignorepath

[ignore-path-resolve-from]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsignorepathresolvefrom

[ignore-patterns]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsignorepatterns

[ignore-unconfigured]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsignoreunconfigured

[silently-ignore]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionssilentlyignore

[plugin-prefix]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionspluginprefix

[config-transform]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsconfigtransform

[options-plugins]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsplugins

[reporter]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsreporter

[reporteroptions]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsreporteroptions

[color]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionscolor

[silent]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionssilent

[quiet]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsquiet

[frail]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsfrail

[files]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/options.md#optionsfiles

[configure]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/configure.md

[ignore]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/ignore.md

[plugins]: https://github.com/alexandroit/stackline-unified-engine/blob/main/doc/plugins.md

[gulp]: https://github.com/unifiedjs/unified-engine-gulp

[language-server]: https://github.com/unifiedjs/unified-language-server

[args]: https://github.com/unifiedjs/unified-args

[remark-cli]: https://github.com/remarkjs/remark/tree/main/packages/remark-cli#readme

See [NOTICE](https://github.com/alexandroit/stackline-unified-engine/blob/main/NOTICE) for retained attribution.
