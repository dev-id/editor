require('babel-core/external-helpers')
require('babel-core/register')

var path = './src'
var arg = process.argv[2]
if (arg)
  path += '/make/' + arg

require(path)
