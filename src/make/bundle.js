import Builder from 'systemjs-builder'
import fs from 'fs'

let babelOptions = JSON.parse(fs.readFileSync('.babelrc'))

new Builder({
  baseURL: 'public/js',
  paths: { fetch: 'node_modules/whatwg-fetch/fetch.js' },
  transpiler: 'babel',
  babelOptions
})
.buildSFX('fetch + index.js', 'public/build/bundle.js', { minify: true })
