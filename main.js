var TcpPort = require("modbus-serial").TcpPort;
var tcpPort = new TcpPort("192.168.1.42");
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU(tcpPort);

const m340 = require('./m340read');
const bits = require('./bit-operations');
bits.addBinFunctions();

// create an empty modbus client
// var ModbusRTU = require("modbus-serial");
// var client = new ModbusRTU();
// // open connection to a tcp line
//client.connectTCP("95.158.47.15", { port: 30502 });
client.connectTCP("192.168.1.100", { port: 502 });
//client.connectTCP("192.168.1.225", { port: 502 });
 
//client.connectTCP(tcpPort, { port: 502 });
client.setID(1);
//client.open();

// console.log("101".bin());
//  console.log(7.5.bin());
// console.log(Number(3.3).bin());
const math = require('./math-utils'); 
console.log(math.uintToInt(32768));
console.log(" 36176 =>" + math.uintToInt(36176));
console.log(" 49407 =>" + math.uintToInt(49407));



function testgetM340registersToFloat(a, b) {
    let sign = (b & 0x8000) ? -1 : 1;
    let E = (b & 0x7F80) >>> 7;
    let restM = b & 0x7F;
    const M = (restM << 16) + a;
    console.log(sign, E , M);
        if (E === 0) {
            return M === 0 ? 0 : sign * Math.pow(2, (-126)) *  M / Math.pow(2, 23) ; 
        } else if (E < 255) {
            return sign * Math.pow(2, (E - 127))* (1 + M / Math.pow(2, 23));
        } else {
                if (M === 0 ) return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
                return NaN;
        }

}

console.log( testgetM340registersToFloat(0, 0));

console.log( (3 << 16) + 3, ((3 << 16) + 3).bin());
const testInt = (1 << 16) & 65536;
console.log( testInt , testInt.bin(), !testInt);
console.log(m340.getRealFromModbusCoils);


    let triesNumber = 0;
let handler = setInterval(function() {
//callbackAPI
    // client.readHoldingRegisters(262, 18, function(err, data) {
    //     const _answer = data.data;
    //     console.log(++triesNumber, /*_answer,*/ m340.getRealFromModbusCoils(_answer, 0), 
    //     _answer[2], _answer[3],
    //     m340.getRealFromModbusCoils(_answer, 4),
    //     m340.getRealFromModbusCoils(_answer, 6),
    //     m340.getRealFromModbusCoils(_answer, 8),
    //     m340.getRealFromModbusCoils(_answer, 10),
    //     m340.getRealFromModbusCoils(_answer, 12),
    //     m340.getRealFromModbusCoils(_answer, 14),

    //     _answer[16], _answer[17],
    //     );
        
    //     if (triesNumber > 9 ) {
    //         clearInterval(handler);
    //         client.close();
    //     }

    // });
    
    //PromiseAPI
    client.readHoldingRegisters(1670, 20).then(data => {
          const _answer = data.data;
        // console.log(++triesNumber, /*_answer,*/ m340.getRealFromModbusCoils(_answer, 0), 
        // _answer[2], _answer[3],
        // m340.getRealFromModbusCoils(_answer, 4),
        // m340.getRealFromModbusCoils(_answer, 6),
        // m340.getRealFromModbusCoils(_answer, 8),
        // m340.getRealFromModbusCoils(_answer, 10),
        // m340.getRealFromModbusCoils(_answer, 12),
        // m340.getRealFromModbusCoils(_answer, 14),
        // _answer[16], _answer[17],
        // );
        //console.log(typeof _answer, Array.isArray(_answer));

        //read array of floats
        console.log(_answer);
        const floats = m340.getFloatsFromMOdbusCoils(_answer);
        console.log(floats);
        
        //read array of ints
        // const int16Arr = new Int16Array(_answer);
        // console.log(_answer, _answer.length, int16Arr, int16Arr.length);
        if (++triesNumber > 1 ) {
            clearInterval(handler);
            client.close();
        }
  
    });
}, 2000);


