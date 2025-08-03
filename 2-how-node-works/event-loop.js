import fs from 'node:fs';
import crypto from 'node:crypto';

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 2;

fs.readFile('test-file.txt', () => {
  console.log('I/O Finished');

  setTimeout(() => console.log('Timer 2 Finished'), 0);
  setTimeout(() => console.log('Timer 3 Finished'), 3000);
  setImmediate(() => console.log('Immediate 2 Finished'));

  process.nextTick(() => console.log('Process.nextTick'));

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha256', () => {
    console.log(Date.now() - start, 'Password Encryption Finished');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha256', () => {
    console.log(Date.now() - start, 'Password Encryption Finished');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha256', () => {
    console.log(Date.now() - start, 'Password Encryption Finished');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha256', () => {
    console.log(Date.now() - start, 'Password Encryption Finished');
  });
});

console.log('Hello from the top-level code');
