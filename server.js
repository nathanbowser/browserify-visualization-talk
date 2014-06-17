var ecstatic = require('ecstatic')(__dirname)
  , http = require('http')
  , cfg = require('./config.js')
  , tw = require('node-tweet-stream')(cfg)
  , server = http.createServer(ecstatic).listen(3000)
  , io = require('socket.io')(server)

tw.track('#WorldCup')

tw.on('tweet', function (tweet) {
  io.emit('tweet', tweet)
})
