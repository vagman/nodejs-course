import http from 'node:http';

const server = http.createServer();

server.on('request', (request, response) => {
  console.log(`Request received for ${request.url}`);
  response.end('Request received!');
});

server.on('request', (request, response) => {
  console.log(`Another request received for ${request.url} 🫡`);
});

server.on('close', () => {
  console.log('Server closed!');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for requests...');
});
