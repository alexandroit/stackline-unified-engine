import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const manifest = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-engine-packed-'))
function run(args, cwd) {
  return execFileSync('npm', args, {cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']})
}
try {
  const packed = JSON.parse(run(['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], root))[0]
  const archive = path.join(temporary, packed.filename)
  for (const key of [manifest.name, 'unified-engine']) {
    const cwd = path.join(temporary, key === manifest.name ? 'direct' : 'alias')
    await mkdir(cwd)
    await writeFile(path.join(cwd, 'package.json'), JSON.stringify({private: true, type: 'module', dependencies: {
      [key]: 'file:' + archive, processor: 'npm:@stackline/remark@1.0.0'
    }}))
    run(['install', '--omit=dev', '--ignore-scripts', '--no-fund'], cwd)
    const tree = JSON.parse(run(['ls', '--all', '--omit=dev', '--json'], cwd))
    assert.deepEqual(tree.problems || [], [])
    const installed = JSON.parse(await readFile(path.join(cwd, 'node_modules', key, 'package.json'), 'utf8'))
    assert.equal(installed.name, manifest.name)
    assert.equal(installed.version, manifest.version)
    assert.deepEqual(installed.dependencies, manifest.dependencies)
    await writeFile(path.join(cwd, 'input.md'), '# hello\n')
    const source = `
      import assert from 'node:assert/strict';
      import {PassThrough} from 'node:stream';
      import {engine} from ${JSON.stringify(key)};
      import {remark} from 'processor';
      assert.throws(() => engine(), /Missing .callback./);
      const stdout = new PassThrough(); const stderr = new PassThrough();
      let output = ''; let report = ''; let calls = 0;
      stdout.on('data', chunk => { output += chunk }); stderr.on('data', chunk => { report += chunk });
      await new Promise((resolve, reject) => engine({processor: remark, cwd: process.cwd(), files: ['input.md'], extensions: ['md'], streamOut: stdout, streamError: stderr}, (error, code) => {
        calls++; if (error) return reject(error); assert.equal(code, 0); resolve();
      }));
      await new Promise(resolve => setImmediate(resolve));
      assert.equal(calls, 1); assert.equal(output, '# hello\\n'); assert.match(report, /input.md: no issues found/);
    `
    execFileSync(process.execPath, ['--input-type=module', '-e', source], {cwd, stdio: 'pipe'})
  }
  console.log('Packed direct and legacy-alias consumers processed Markdown through the real callback API.')
} finally {
  await rm(temporary, {recursive: true, force: true})
}
