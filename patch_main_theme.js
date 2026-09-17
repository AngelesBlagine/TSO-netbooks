import fs from 'fs';
let main = fs.readFileSync('main.js', 'utf8');

main = main.replace(
  'toggleTheme,\n  initTheme,',
  'setThemeMode,\n  setThemeColor,\n  initTheme,'
);

main = main.replace(
  'window.toggleTheme = toggleTheme;',
  'window.setThemeMode = setThemeMode;\nwindow.setThemeColor = setThemeColor;'
);

fs.writeFileSync('main.js', main);
console.log('main.js updated');
