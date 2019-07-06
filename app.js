//socet.io testing
var TcpPort = require("modbus-serial").TcpPort;
var tcpPort = new TcpPort("192.168.1.42");
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU(tcpPort);

const m340 = require('./m340read');
const bits = require('./bit-operations');
bits.addBinFunctions();
let handler = 0;

let m340data = [];


// create an empty modbus client
// var ModbusRTU = require("modbus-serial");
// var client = new ModbusRTU();
// // open connection to a tcp line
//client.connectTCP("95.158.47.15", { port: 30502 });
client.connectTCP("192.168.1.100", { port: 502 });
//client.connectTCP("192.168.1.225", { port: 502 });
 
//client.connectTCP(tcpPort, { port: 502 });
client.setID(1);

handler = setInterval(function() {
    //PromiseAPI
   client.readHoldingRegisters(2208, 6).then(data => {
         const _answer = data.data;
         //   console.log(_answer);
       const floats = m340.getFloatsFromMOdbusCoils(_answer);
       //console.log(floats);
       m340data = floats;
    const socketMessage = JSON.stringify(floats.map(el => el.toFixed(3)));
       console.log(socketMessage);
        io.sockets.emit('newdata', socketMessage);
   });
}, 1000);


const http = require('http');
const fs = require('fs');

// Загружаем файл index.html для отображения клиенту
const server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);

    });
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

})



server.listen(3001);