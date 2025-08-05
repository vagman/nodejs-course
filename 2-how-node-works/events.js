import EventEmitter from 'node:events';

const myEmitter = new EventEmitter();

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

myEmitter.on('newSale', () => {
  console.log('There was a new sale!');
});

myEmitter.on('newSale', () => {
  console.log('Costumer name: Jonas');
});

myEmitter.on('newSale', stock => {
  console.log(`There are now ${stock} items left in stick.`);
});

myEmitter.emit('newSale', 9);
