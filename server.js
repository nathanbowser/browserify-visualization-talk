var ecstatic = require('ecstatic')(__dirname)
  , http = require('http')
  , cfg = require('./config.js')
  , tw = require('node-tweet-stream')(cfg)
  , server = http.createServer(ecstatic).listen(3000)
  , io = require('socket.io')(server)

tw.track('football')
tw.track('soccer')
tw.track('brazil')
tw.track('#AUSvsNED')
tw.track('worldcup')

tw.on('tweet', io.emit.bind(io, 'tweet'))
