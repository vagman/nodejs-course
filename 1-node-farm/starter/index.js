// fs = file system used for reading/writing data
const fs = require('fs')

const hello  = 'Hello World';
console.log(hello);

const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textInputs);

const