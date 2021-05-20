const camel_to_snake = str => str[0].toLowerCase() + str.slice(1, str.length).replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

function get(id){
    return document.getElementById(id);

}