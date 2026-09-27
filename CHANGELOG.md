# Changelog

## 1.0.0

- Fork unified-engine 10.1.0 under @stackline with its MIT license, callback API and unified 10 / vfile 5 type model.
- Replace glob 8 with glob 13 and bridge the Promise result into the existing callback flow; explicitly preserve brace expansion detection.
- Use @stackline/load-plugin to remove deprecated glob dependencies from plugin resolution.
- Preserve exact public declaration files from the verified upstream npm release; validate consumer types with current TypeScript.
- Add brace, extglob, multi-pattern, unmatched, directory, ignore and single-file regression coverage; retain upstream integration suites.
