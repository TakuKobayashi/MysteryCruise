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

app.use("/jsqr", express.static(__dirname + "/node_modules/jsqr/dist/"));

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
      con.send(
        JSON.stringify(
          Object.assign(messageObj, {
            action_name: "message",
          })
        )
      );
    });
  });
});

app.get('/notice', function (req, res) {
  dataModel.reload();
  let missionId = 0;
  if (req.query.missionId) {
    missionId = parseInt(req.query.missionId);
  }
  let missionObj = dataModel.findBy("missions", {
    id: missionId,
  });
  console.log(missionId);
  console.log(missionObj);
  if (missionObj && missionObj.is_published == 0) {
    connections.forEach(function (con, i) {
      con.send(JSON.stringify(
        Object.assign(missionObj, {
          action_name: "mission",
        })
      ));
    });
    missionObj = dataModel.update("missions", {
      id: missionId
    }, {
      is_published: 1
    });
    res.json({
      success: true
    });
  } else {
    res.json({
      success: false
    });
  }
});

app.get('/', function (req, res) {
  res.render('./index.ejs');
});

app.get('/badge', function (req, res) {
  res.render('./badge.ejs');
});

app.get('/chat', function (req, res) {
  res.render('./chat.ejs');
});

app.get('/action', function (req, res) {
  res.render('./action.ejs');
});

app.get('/play', function (req, res) {
  res.render('./play.ejs');
});

app.get('/messages', function (req, res) {
  const page = req.query.page || "0";
  const messages = dataModel.last("messages", 20, parseInt(page));
  res.json(messages);
});


app.post('/call_location', function (req, res) {
  const params = req.body;
  console.log(params);
  let userModel = dataModel.findBy("users", {
    uuid: params.userUuid,
  });
  if (userModel) {
    const messageObj = {
      "user_uuid": "locationInfo",
      "text": `${userModel.uuid}さんが食堂のQRCodeを読み込みました!!`,
      "uuid": uuid()
    }
    dataModel.create("messages", messageObj);
    connections.forEach(function (con, i) {
      con.send(JSON.stringify(
        Object.assign(messageObj, {
          action_name: "message",
        })
      ));
    });
    res.json(messageObj);
  } else {
    res.json({});
  }
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