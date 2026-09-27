import assert from 'node:assert/strict'
import {mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join, relative, resolve} from 'node:path'
import test from 'node:test'
import {finder} from '../lib/finder.js'

test('glob 13 preserves brace, extglob, directory, and ignore behavior', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'stackline-engine-'))
  try {
    await mkdir(join(cwd, 'nested'))
    for (const name of ['a.txt', 'b.txt', 'c.md', '.hidden.txt', 'nested/d.txt']) {
      await writeFile(join(cwd, name), name)
    }

    async function find(patterns, extra = {}) {
      let calls = 0
      const result = await new Promise((resolve, reject) => {
        finder(patterns, {
          cwd,
          extensions: ['.txt'],
          ignorePatterns: [],
          ignore: {check(_path, callback) { callback(null, false) }},
          ...extra
        }, (error, result) => {
          ++calls
          if (error) reject(error)
          else resolve(result)
        })
      })
      await new Promise((resolve) => setImmediate(resolve))
      assert.equal(calls, 1, 'callback is called once')
      return result
    }

    function paths(result) {
      return result.files.map((file) => relative(cwd, resolve(file.cwd, file.path)).split('\\').join('/')).sort()
    }

    assert.deepEqual(paths(await find(['{a,b}.txt'])), ['a.txt', 'b.txt'])
    assert.deepEqual(paths(await find(['+(a|b).txt'])), ['a.txt', 'b.txt'])
    assert.deepEqual(paths(await find(['*.md', 'nested/*.txt'])), ['c.md', 'nested/d.txt'])
    assert.deepEqual(paths(await find(['**/*.txt'])), ['a.txt', 'b.txt', 'nested/d.txt'])
    assert.deepEqual(paths(await find(['missing-*.txt'])), [])
    assert.deepEqual(paths(await find(['**/nested'])), ['nested/d.txt'])
    assert.deepEqual(paths(await find(['**/*.txt'], {ignorePatterns: ['b.txt'], silentlyIgnore: true})), ['a.txt', 'nested/d.txt'])
    const literal = await find(['a.txt'])
    assert.equal(literal.oneFileMode, true)
    assert.equal((await find(['{a,b}.txt'])).oneFileMode, false)
  } finally {
    await rm(cwd, {recursive: true, force: true})
  }
})
