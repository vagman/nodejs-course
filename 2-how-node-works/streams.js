import fs from 'node:fs';
import http from 'node:http';

const server = http.createServer();

server.on('request', (request, response) => {
  // Solution 1: Using fs.createReadStream (Asynchronous but loads entire file into memory at once)
  //   fs.readFile('./test-file.txt', (err, data) => {
  //     if (err) console.error('Error reading file:', err);
  //     response.end(data);
  //   });

  // Solution 2: Using fs.createReadStream (True stream, reads file in chunks)
  //   const readableStream = fs.createReadStream('./test-file.txt');
  //   readableStream.on('data', chunk => {
  //     response.write(chunk);
  //   });
  //   readableStream.on('end', () => {
  //     response.end();
  //   });
  //   readableStream.on('error', error => {
  //     console.log(error);
  //     response.statusCode = 500;
  //     response.end('File not found!');
  //   });

  // Solution 3: Using pipe (Simpler way to handle streams)
  const readableStream = fs.createReadStream('./test-file.txt');
  readableStream.pipe(response);
  // Pipe works like this: readableSource.pipe(writableDestination);
  response.end();
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server is listening on http://127.0.0.1:8000...');
});
