// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) Inpu contributors
// Build-time packaging only: no application execution or endpoint requests.
import { readFile, readdir, mkdir, writeFile, lstat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { zipSync } from 'fflate'

const rootFiles = [
  'LICENSE', 'README.md', 'THIRD_PARTY.md', 'package.json', 'package-lock.json',
  'index.html', 'vite.config.ts', 'eslint.config.js',
  'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', '.gitignore', '.gitmodules',
]
const sourceDirectories = ['src', 'scripts', 'docs', 'public', '.github']
// Include the actual database snapshot, not just a Git submodule pointer.
const databaseFiles = [
  'inpu-db/001_schema.sql', 'inpu-db/002_hieroglyph_data.sql',
  'inpu-db/003_gardiner_sign_data.sql', 'inpu-db/tools/generate_gardiner_sql.py',
]
const files = [...rootFiles, ...databaseFiles]
async function collect(directory) {
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    // Never package local metadata, environment files, or symlink targets.
    if (entry.name.startsWith('.')) continue
    const path = `${directory}/${entry.name}`
    if (entry.isDirectory()) await collect(path)
    else if (entry.isFile()) files.push(path)
  }
}
for (const directory of sourceDirectories) await collect(directory)

const contents = {}
const hashes = {}
for (const file of files.sort()) {
  if (!(await lstat(file)).isFile()) throw new Error(`Expected source file: ${file}`)
  const bytes = await readFile(file)
  contents[`inpu/${file}`] = bytes
  hashes[file] = createHash('sha256').update(bytes).digest('hex')
}

// Preserve the published notices for installed production dependencies too.
const lock = JSON.parse(await readFile('package-lock.json', 'utf8'))
const notices = []
for (const [path, dependency] of Object.entries(lock.packages).sort()) {
  if (!path || dependency.dev) continue
  let entries
  try {
    entries = await readdir(path, { withFileTypes: true })
  } catch (error) {
    if (dependency.optional && error.code === 'ENOENT') continue
    throw error
  }
  const manifest = JSON.parse(await readFile(`${path}/package.json`, 'utf8'))
  notices.push(`${manifest.name} ${manifest.version}\nLicense: ${manifest.license ?? 'See package notices'}\nPackage: ${dependency.resolved ?? path}`)
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile() || !/^(licen[cs]e|copying|notice|copyright)/i.test(entry.name)) continue
    const bytes = await readFile(`${path}/${entry.name}`)
    notices.push(`${entry.name}\n${bytes.toString('utf8')}`)
    contents[`inpu/dependency-notices/${path}/${entry.name}`] = bytes
  }
}
const npmNotices = notices.join('\n\n----------------------------------------\n\n') + '\n'
contents['inpu/dependency-notices/npm-notices.txt'] = Buffer.from(npmNotices)
contents['inpu/SOURCE-SNAPSHOT.json'] = Buffer.from(JSON.stringify({
  description: 'SHA-256 of the application and database files used in this build.', files: hashes,
}, null, 2) + '\n')

await mkdir('dist/source', { recursive: true })
await mkdir('dist/licenses', { recursive: true })
await writeFile('dist/source/inpu-source.zip', zipSync(contents, { level: 6 }))
await writeFile('dist/licenses/Inpu-GPL-3.0.txt', await readFile('LICENSE'))
await writeFile('dist/licenses/THIRD_PARTY.md', await readFile('THIRD_PARTY.md'))
await writeFile('dist/licenses/npm-notices.txt', npmNotices)
console.log(`Packaged ${files.length} source files, database snapshot, and dependency notices for this build.`)
