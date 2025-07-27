// fs = file system used for reading/writing data
import { readFileSync, writeFileSync } from 'node:fs';

const hello  = 'Hello World';
console.log(hello);

// Synchronous code / Blocking way that executed line by line
const textInput = readFileSync('./txt/input.txt', 'utf-8');
console.log(textInput);
const textOutput = `This is what we know about avocado: ${textInput}.\nCreated on ${Date.now()}`;
writeFileSync('./txt/output.txt', textOutput);
console.log('File written!');

// Asynchronous way / Non-blocking way
readFileSync('./txt/start.txt', 'utf-8', (error, data) => {
    console.log(data);
});
console.log('Reading file asynchronously...');

