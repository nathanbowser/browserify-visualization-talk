var http = require('http')
  , url = require('url')
  , request = require('request')
  , fs = require('fs')

http.createServer(function (req, res) {
  var _url = url.parse(req.url, true)
     , path = _url.pathname

  if (path == '/index.html' || path == '/') {
    return fs.createReadStream(__dirname + '/index.html').pipe(res)
  } else if (path == '/bundle.js') {
    return fs.createReadStream(__dirname + '/bundle.js').pipe(res)
  } else if (path === '/tree.json') {
    request('http://isaacs.couchone.com/registry/_all_docs').pipe(res)
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.write('Not found')
    res.end()
  }
}).listen(3000)
