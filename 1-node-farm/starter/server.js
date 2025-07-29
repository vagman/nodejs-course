import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Server Routing
const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    return output;
};

const templateOverview = readFileSync(fileURLToPath(import.meta.resolve('./templates/template-overview.html')), 'utf-8');
const templateProduct = readFileSync(fileURLToPath(import.meta.resolve('./templates/template-product.html')), 'utf-8');
const templateCard = readFileSync(fileURLToPath(import.meta.resolve('./templates/template-card.html')), 'utf-8');

const data = readFileSync(fileURLToPath(import.meta.resolve('./dev-data/data.json')), 'utf-8');
const dataObject = JSON.parse(data);

const server = http.createServer((request, response) => {
    const pathName = request.url;

    // Overview Page
    if (pathName === '/' || pathName === '/overview') {      
        response.writeHead(200, {'Content-type': 'text/html'});

        const cardsHTML = dataObject.map(element => 
            replaceTemplate(templateCard, element)
        ).join('');
        const output = templateOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);
        response.end(output);

    // Product Page
    } else if (pathName === '/product') {
        response.end('This is the PRODUCT');

    // API
    } else if (pathName ==='/api') {
        response.writeHead(200, {'Content-type': 'application/json'});
        response.end(data);

    // Not Found    
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
