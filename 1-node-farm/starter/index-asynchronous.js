import { readFile, writeFile } from 'node:fs';

readFile('./txt/start.txt', 'utf-8', (error, data1) => {
    if (error) return console.log('ERROR: File specified not found.')
    readFile(`./txt/${data1}.txt`, 'utf-8', (error, data2) => {
        console.log(data2);
        readFile('./txt/append.txt', 'utf-8', (error, data3) => {
            console.log(data3);

            writeFile('./txt/final.txt', `${data2}\n${data3}` ,'utf-8', error => {
                console.log('Your new file has been written :)');
            })
        });
    });
});
console.log('Reading file asynchronously...');
