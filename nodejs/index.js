var express = require('express');
var app = express();
const uuid = require('uuid/v4');
const url = require('url');

//use path static resource files
app.use(express.static('public'));

var port = process.env.PORT || 8000;

//wake up http server
var http = require('http');

//Enable to receive requests access to the specified port
var server = http.createServer(app).listen(port, function () {
  console.log('Server listening at port %d', port);
});

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
  server: server
});

server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/chat') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws);
    });
  }
});

var connections = [];
wss.on('connection', function (ws) {
  console.log('connect!!');
  connections.push(ws);
  ws.on('close', function () {
    console.log('close');
    connections = connections.filter(function (conn, i) {
      return (conn === ws) ? false : true;
    });
  });
  ws.on('message', function (message) {
    console.log('message:', message);
    connections.forEach(function (con, i) {
      con.send(message);
    });
  });
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/chat', function (req, res) {
  res.sendFile(__dirname + '/chat.html');
});

app.post('/login', function (req, res) {
  const user_uuid = req.query("user_uuid");
  if (!user_uuid) {
    user_uuid = uuid();
  }
  res.cookie('user_uuid', user_uuid);
  res.json({
    user_uuid: user_uuid
  });
});