import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  '<div id="kit-modal" class="modal-overlay">',
  '<div id="kit-modal" class="modal-overlay" onclick="if(event.target === this) closeKitModal()">'
);

fs.writeFileSync('index.html', html);
