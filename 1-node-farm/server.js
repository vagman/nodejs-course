import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

// Importing a 3rd party module
import slugify from 'slugify';

import replaceTemplate from './modules/replaceTemplate.js';

// Server Routing
const templateOverview = readFileSync(fileURLToPath(import.meta.resolve('./templates/template-overview.html')), 'utf-8');
const templateProduct = readFileSync(fileURLToPath(import.meta.resolve('./templates/template-product.html')), 'utf-8');
const templateCard = readFileSync(fileURLToPath(import.meta.resolve('./templates/template-card.html')), 'utf-8');

const data = readFileSync(fileURLToPath(import.meta.resolve('./dev-data/data.json')), 'utf-8');
const dataObject = JSON.parse(data);

// Slugify options
const slugs = dataObject.map(product => slugify(product.productName, { lower: true}));
// console.log(slugs);

const server = http.createServer((request, response) => {
    const requestURL = new URL(request.url, `http://${request.headers.host}`);
    const pathName = requestURL.pathname;

    // Get the query id from the URL
    // e.g. /product?id=0
    const query = requestURL.searchParams.get('id'); 

    // Overview Page
    if (pathName === '/' || pathName === '/overview') {
        response.writeHead(200, {'Content-type': 'text/html'});

        // Generate HTML for each product card
        // and replace the placeholder in the overview template
        const cardsHTML = dataObject.map(element => 
            replaceTemplate(templateCard, element)
        ).join('');
        const output = templateOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);
        response.end(output);

    // Product Page
    } else if (pathName === '/product') {
        const product = dataObject[query];
        const output = replaceTemplate(templateProduct, product);
        response.end(output);

    // API
    } else if (pathName ==='/api') {
        response.writeHead(200, {'Content-type': 'application/json'});
        response.end(dat a);

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
