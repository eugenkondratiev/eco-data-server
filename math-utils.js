function isEven(number) {
    if(number % 2 === 0){
      return true;
    }else if(isNaN(number)){
      return "is Nan";
    }else{
      return false;
    }
  };

function uintToInt(int) {
    //???
    return  int<<64>>64 //int>>>0
}

  module.exports = {
      isEven : isEven,
      uintToInt : uintToInt
  }