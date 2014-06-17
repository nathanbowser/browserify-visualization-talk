var WebSocketServer = require('ws').Server
  , websocket = require('websocket-stream')
  , http = require('http')
  , ecstatic = require('ecstatic')(__dirname)
  , es = require('event-stream')
  , Stream = require('stream')

var server = http.createServer(ecstatic).listen(3000)
  , wss = new WebSocketServer({server: server})

var times = 0
wss.on('connection', function (ws) {
  var treeStream = new Stream
  treeStream.readable = true

  var nodes = [{
    id: 1,
    label: 'Root',
    color: 'green'
  }]

  var iv = setInterval(function () {
    var p = nodes[Math.random() * nodes.length | 0] // random parent
      , n = {
        id: nodes.length + 1,
        label: 'Child ' + nodes.length,
        color: nodes.length % 2 == 0 ? 'green' : 'red',
        parent: p.id
      }
    nodes.push(n)
    treeStream.emit('data', JSON.stringify(n))
  }, 750)

  treeStream.pipe(websocket(ws))
  treeStream.emit('data', JSON.stringify(nodes[0]))
})
