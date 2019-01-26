const express = require('express');
const app = express();
const uuid = require('uuid/v4');
const url = require('url');
const fs = require('fs');
const bodyParser = require('body-parser');

const commonDataJson = fs.readFileSync('../data.json');
let commonData = JSON.parse(commonDataJson);

const saveCommonDataJson = function () {
  fs.writeFileSync(JSON.stringify(commonData));
}

app.use(bodyParser.urlencoded({
  extended: true
}));
//use path static resource files
app.use(express.static('public'));

// テンプレートエンジンの設定
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

const port = process.env.PORT || 8000;

//wake up http server
const http = require('http');

//Enable to receive requests access to the specified port
const server = http.createServer(app).listen(port, function () {
  console.log('Server listening at port %d', port);
});

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({
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

const connections = [];
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
  res.render('./index.ejs');
});

app.get('/chat', function (req, res) {
  res.render('./chat.ejs');
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