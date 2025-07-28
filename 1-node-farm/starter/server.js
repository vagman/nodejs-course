import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Server Routing
const dataPath = fileURLToPath(import.meta.resolve('./dev-data/data.json'));
const data = readFileSync(dataPath, 'utf-8');
const dataObject = JSON.parse(data);

const server = http.createServer((request, response) => {
    const pathName = request.url;
    if (pathName === '/' || pathName === '/overview') {
        response.end('This is the OVERVIEW');
    } else if (pathName === '/product') {
        response.end('This is the PRODUCT');
    } else if (pathName ==='/api') {
        response.writeHead(200, {'Content-type': 'application/json'});
        response.end(data);
    }else {
        response.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        response.end('<h1>Error 404: Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});
