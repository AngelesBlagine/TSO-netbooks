import fs from 'fs';
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<button\s+class="btn btn-secondary"\s+style="[^"]*"\s+onclick="toggleTheme\(\)"[\s\S]*?<\/button>/;
html = html.replace(regex, '');

fs.writeFileSync('index.html', html);
console.log('Old toggle removed');
