var WebSocketServer = require('ws').Server
  , websocket = require('websocket-stream')
  , Through = require('stream').PassThrough
  , http = require('http')
  , ecstatic = require('ecstatic')(__dirname)
  , es = require('event-stream')
  , cfg = require('./config.js')
  , tw = require('node-tweet-stream')(cfg)
  , server = http.createServer(ecstatic).listen(3000)
  , wss = new WebSocketServer({server: server})

tw.track('football')
tw.track('soccer')
tw.track('brazil')
tw.track('worldcup')

var stream = new Through({objectMode: true})
tw.on('tweet', stream.write.bind(stream))

wss.on('connection', function (ws) {
  stream.pipe(es.stringify()).pipe(websocket(ws))
})
