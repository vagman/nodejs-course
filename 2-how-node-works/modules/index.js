import Calculator from './calculator-modules-exports.js';
const calculator = new Calculator();
// console.log(calculator.add(4, 5));

// importing named exports (ESM) - modern way
import { add, multiply, divide, subtract } from './calculator-module.js';
console.log(add(4, 5));

// CJS - old way using require
// const calculatorCJS = require('./calculator-module.js');
// console.log(calculatorCJS.add(4, 5));

// Caching
import test from './module-cache.js';
test();
test();
test();
