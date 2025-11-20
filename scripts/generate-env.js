// scripts/generate-env.js
const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'assets', 'env.js');

const envFileContent = `
(function(window) {
  window.__env = window.__env || {};
  window.__env.API_URL = "${process.env.API_URL || ''}";
})(this);
`;

fs.writeFileSync(targetPath, envFileContent, { encoding: 'utf8' });

console.log('Environment file created at:', targetPath);
