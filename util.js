const camel_to_snake = str => str[0].toLowerCase() + str.slice(1, str.length).replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

function get(id){
    return document.getElementById(id);

}

function isObj(obj){

    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

function isPrimitive(obj){
    let t = typeof obj;
    return t == "number" || t == "boolean" || t == "string"
    
}

function isEmpty( el ){
    return !$.trim(el.html())
}

function $svg(svgName){
    return document.createElementNS('http://www.w3.org/2000/svg', svgName)
}

function getParamNames(func) {

    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
     result = [];
  return result;
}