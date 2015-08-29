import Builder from 'systemjs-builder'

let builder = new Builder({
  baseURL: 'public/js',
  transpiler: 'babel',
  babelOptions: {
    loose: 'all'
  }
})
.buildSFX('index.js', 'public/bundle.js', { minify: true })
