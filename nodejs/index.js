const express = require('express');
const app = express();
const uuid = require('uuid/v4');
const url = require('url');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const DataModel = require('./data_model');
const dataModel = new DataModel();

app.use(cookieParser());
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

let connections = [];
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
    const messageObj = JSON.parse(message);
    messageObj.uuid = uuid();
    dataModel.create("messages", messageObj);
    connections.forEach(function (con, i) {
      con.send(JSON.stringify(messageObj));
    });
  });
});

app.get('/', function (req, res) {
  res.render('./index.ejs');
});

app.get('/chat', function (req, res) {
  const messages = dataModel.last("messages", 20);
  res.render('./chat.ejs', {
    messages: messages
  });
});

app.post('/sign_in', function (req, res) {
  const user_uuid = req.cookies.user_uuid;
  let userModel = dataModel.findBy("users", {
    uuid: user_uuid
  });
  if (userModel) {
    userModel = dataModel.update("users", {
      uuid: user_uuid
    }, {
      lastAccessedAt: new Date().getTime()
    });
  } else {
    userModel = {
      uuid: uuid(),
      lastAccessedAt: new Date().getTime(),
      createdAt: new Date().getTime(),
    }
    dataModel.create("users", userModel);
  }
  res.cookie('user_uuid', userModel.uuid);
  res.json(userModel);
});