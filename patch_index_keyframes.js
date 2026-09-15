import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const keyframesCSS = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
`;

html = html.replace('</style>', keyframesCSS + '</style>');

fs.writeFileSync('index.html', html);
