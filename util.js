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