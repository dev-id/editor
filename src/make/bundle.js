import Builder from 'systemjs-builder'
import fs from 'fs'

let babelOptions = JSON.parse(fs.readFileSync('.babelrc'))

new Builder({
  baseURL: 'public/js',
  transpiler: 'babel',
  babelOptions
})
.buildSFX('index.js', 'public/bundle.js', { minify: true })
