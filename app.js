/*socet.io testing*/

var TcpPort = require("modbus-serial").TcpPort;
var tcpPort = new TcpPort("192.168.1.225");
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU(tcpPort);

const BLOCK_START = 3200;
const BLOCK_SIZE = 100;

const m340 = require('./m340read');
const bits = require('./bit-operations');
bits.addBinFunctions();
let handler = 0;

//let m340data = [];
let m340data = require('./scripts/m340data');
const logIt = require('./logger');

let eco1 = [];

const WebSocketServer = new require('ws');
const wsClients = {};
const webSocketServer = new WebSocketServer.Server({port : 8081});

webSocketServer.on('connection', function(ws) {
    let id = Math.random();
    wsClients[id] = ws;

    ws.on('message', function(message) {;
        let _eco1LastDayW38 = 0.001;
        let outMessage = message;
        //console.log(message);
        try {
            const jsonMessage = JSON.parse(JSON.parse(JSON.stringify(message)));
            //_eco1LastDayW38 = jsonMessage;
            console.log("_jsonMessage", jsonMessage);
            eco1 = jsonMessage.eco1;
            // eco1.array.forEach((element, index) => {
            //     m340data[48-index] = element;
            // });

            console.log("eco1LastDayW38", eco1);

        } catch (error) {
            console.log(error.message);
            
        }

        // console.log("outMesage", message);
        // for (let key in wsClients) {
        //     wsClients[key].send(message);
        // }
    });

    ws.on('close', function() {

        delete wsClients[id];
    })
});

// create an empty modbus client
// var ModbusRTU = require("modbus-serial");
// var client = new ModbusRTU();
// // open connection to a tcp line
client.connectTCP("95.158.47.15", { port: 502 });
//client.connectTCP("192.168.1.100", { port: 502 });
//client.connectTCP("192.168.1.225", { port: 502 });
 
//client.connectTCP(tcpPort, { port: 502 });
client.setID(1);

handler = setInterval(function() {
    //PromiseAPI
    try {
        client.readHoldingRegisters(BLOCK_START, BLOCK_SIZE).then(data => {
            const _answer = data.data;
            //   console.log(_answer);
          const floats = m340.getFloatsFromMOdbusCoils(_answer);
          //console.log(floats);
          m340data = floats;
          eco1.forEach((el, index) => {
            m340data[48 - index] = parseFloat(el);
          });
          // console.log("m340data", m340data.length, m340data);
          console.log("eco1", eco1.length, eco1);
         // m340data[48] = parseFloat(eco1[0]);

       const socketMessage = JSON.stringify(floats.map(el => 
        isFinite(Number(el)) ? el.toFixed(3) : "NaN")
        );
        //  console.log(socketMessage);
           io.sockets.emit('newdata', socketMessage);
      });

    } catch (error) {
        console.log(error.message);
        
    }
 
}, 2000);


const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const mimeType = {
    '.htm' : 'text/html',
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'application/javascript',
    'json' : 'application/json'
};

// Загружаем файл index.html для отображения клиенту
const server = http.createServer(function(req, res) {

    const parsedUrl = url.parse(req.url, true);
    let pathname = path.join(__dirname,parsedUrl.pathname);

    try {
        // logIt(req);
        // logIt(rparsedUrl);

        fs.exists(pathname, function(exist) {
            if (!exist) {
                res.statusCode = 404;
                res.end(`File ${pathname}not found`);
            }

            if (fs.statSync(pathname).isDirectory()) {
                pathname += 'index.html'
            }
            console.log("pathname ", pathname);
            console.log("urls", parsedUrl, pathname);

            fs.readFile(pathname, function(err, data) {
                if (err) {
                    res.statusCode = 500;
                    res.end(`Error getting file ${err} `);
                } else {
                    const ext = path.parse(pathname).ext;
                    res.setHeader('Content-type', mimeType[ext] || 'text/html');
                    res.end(data);
                }
            } );
                
        });
        logIt('Server created');
        
    } catch (error) {
        console.log(error.message);
    }

//     fs.readFile('./index.html', 'utf-8', function(error, content) {
//         res.writeHead(200, {"Content-Type": "text/html"});
//         res.end(content);

//     });

});

// Загрузка socket.io
const io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, username) {
    // Когда клиент подключается, им отправляется сообщение
    socket.emit('message', 'You are connected!');
    // Другим клиентам сообщается, что пришёл кто-то новый
   socket.broadcast.emit('message', 'Another client has just connected!');

    // Как только получено имя пользователя, оно сохраняется в переменной
    socket.on('little_newbie', function(username) {
        socket.username = username;
    });

    // Когда сообщение типа "message" получено (нажатие на кнопку), оно записывается в консоль
    socket.on('message', function (message) {
        // Имя пользователя посетителя, который нажал на кнопку, извлекается из переменной сессии
        console.log(socket.username + ' is speaking to me! They\'re saying: ' + message);
    }); 
});
io.sockets.on('newdata', function (socket, username) {
    socket.broadcast.emit('newdata', m340data);

});



server.listen(3001);