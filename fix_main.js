import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

main = main.replace(/\\n/g, '\n');

fs.writeFileSync('main.js', main);
