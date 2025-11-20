const fs = require('fs');
const path = require('path');

// Ensure the directory exists (safeguard)
const dir = path.join(__dirname, '..', 'src', 'assets');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const targetPath = path.join(dir, 'env.js');

// 1. Read NG_APP_API_URL from process.env (Netlify)
// 2. Write it to window.__env.NG_APP_API_URL (Browser)
const envFileContent = `
(function(window) {
  window.__env = window.__env || {};
  window.__env.NG_APP_API_URL = "${process.env.NG_APP_API_URL || 'https://localhost:4002'}";
})(this);
`;

fs.writeFileSync(targetPath, envFileContent, { encoding: 'utf8' });

console.log('Environment file created at:', targetPath);
