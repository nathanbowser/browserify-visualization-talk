var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , colors = [ 'red', 'green' ]
  , d3 = require('d3')

var tree = function (depth) {
  var id = 0
    , depth = parseInt(depth, 10)

  function generateChildren (numChildren, subLevels) {
    var nodes = []
    for (var i = numChildren; i > 0; i--) {
      var node = {
        id: ++id,
        label: 'Scorecard ñode ' + id,
        color: colors[id % 2]
      }

      node.children = subLevels === 0 ? [] : generateChildren(numChildren, subLevels - 1)

      nodes.push(node)
    }

    return nodes
  }

  return {
    id: ++id,
    label: 'Node ' + id ,
    color: colors[id % 2],
    children: generateChildren(depth, 2)
  }
}

http.createServer(function (req, res) {
  var _url = url.parse(req.url, true)
     , path = _url.pathname

  if (path == '/index.html' || path == '/') {
    return fs.createReadStream(__dirname + '/index.html').pipe(res)
  } else if (path == '/bundle.js') {
    res.writeHead(200, {'Content-Type': 'application/javascript'})
    return fs.createReadStream(__dirname + '/bundle.js').pipe(res)
  } else if (path === '/tree.json') {
    res.end(JSON.stringify(d3.layout.tree().nodes(tree(_url.query.depth || 5)), function (key, value) {
      if (key === 'parent') {
        return value.id
      } else if (key === 'children'){
        return undefined
      } else {
        return value
      }
    }))
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.write('Not found')
    res.end()
  }
}).listen(3000)
