const math = require('./math-utils'); 

function getM340registersToFloat(a, b) {
    let sign = (b & 0x8000) ? -1 : 1;
    let E = (b & 0x7F80) >>> 7;
    let restM = b & 0x7F;
    const M = (restM << 16) + a;
    //console.log(sign, E , M);
    if (E > 0) {
        return sign * Math.pow(2, (E - 127))* (1 + M / Math.pow(2, 23));
    } else {
        return sign * Math.pow(2, (-126)) *  M / Math.pow(2, 23) ; 
    }
}


function getRealFromModbusCoils(data, index) {
    return getM340registersToFloat(data[index], data[index + 1]);
}


function getIntsFromMOdbusCoils(data) {
    return new Int16Array(data); // UInt16 array to Int16 array
}


function getFloatsFromMOdbusCoils(data) {
    const arr = [];
    if (Array.isArray(data)) {
        data.forEach((element,index, _data) => {
            if (math.isEven(index) && index < _data.length - 1) arr.push(getM340registersToFloat(element, _data[index + 1]));
        });
    }
    return arr;
}

module.exports = {
    getM340registersToFloat :getM340registersToFloat,
    getRealFromModbusCoils : getRealFromModbusCoils,
    getIntsFromMOdbusCoils :getIntsFromMOdbusCoils,
    getFloatsFromMOdbusCoils : getFloatsFromMOdbusCoils
}
