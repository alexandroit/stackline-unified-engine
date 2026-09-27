# Preserved upstream declarations

The declaration files are retained byte-for-byte from `unified-engine@10.1.0`, gitHead `5468193d0e000d321718e5612c10362b8bd7df3b`. Its npm tarball SHA-512 integrity is `sha512-5+JDIs4hqKfHnJcVCxTid1yBoI/++FfF/1PFdSMpaftZZZY+qg2JFruRbf7PaIwa9KgLotXQV3gSjtY0IdcFGQ==`. The finder dependency update does not change the public callback API or the unified 10 / vfile 5 type model. `npm run test:types` checks consumers with modern TypeScript.

The original source-wide JSDoc build cannot be run unchanged on TypeScript 7: it reports pre-existing inference and exactOptionalPropertyTypes errors across unrelated modules. No claim of source-wide TS7 validation is made.
