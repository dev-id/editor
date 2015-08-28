import http from 'http'
import url from 'url'

import getRawBody from 'raw-body'
import send from 'send'
import api from './api'

http
.createServer((req, res) => {
  let {pathname} = url.parse(req.url)
  let split = pathname.slice(1).split('/')

  if (req.method === 'POST')
    return getRawBody(req, 'utf8', (err, str) => {
      if (err)
        return res.end(JSON.stringify({ error: err.message }))

      let data = api(split[0], str)
      res.end(JSON.stringify(data))
    })

  send(req, pathname, { root: 'public' })
  .pipe(res)
}).listen(1337)

console.log(new Date)
