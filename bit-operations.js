function addBinFunctions() {
    String.prototype.bin = function () {
        return parseInt(this, 2);
    };
    Number.prototype.bin = function () {
        var sign = (this < 0 ? "-" : "");
        var result = Math.abs(this).toString(2);
        while(result.length < 32) {
            result = "0" + result;
        }
        return sign + result;
    }
    ;
}

function modulo(a, b) {
    return a - Math.floor(a/b)*b;
}
function ToInteger(x) {
    x = Number(x);
    return x < 0 ? Math.ceil(x) : Math.floor(x);
}
function ToUint32(x) {
    return modulo(ToInteger(x), Math.pow(2, 32));
}


function getUInt32From2Int(a, b) {
    return (ToUint32(b) << 16) + ToUint32(a); // Uint32
   // return ToUint32(a) << 16;
}



module.exports = {
    modulo :modulo,
    ToInteger : ToInteger,
    ToUint32 : ToUint32,
    addBinFunctions :addBinFunctions,
    getUInt32From2Int :getUInt32From2Int
}