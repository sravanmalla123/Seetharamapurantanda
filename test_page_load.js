const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const htmlPath = path.join(__dirname, 'public', 'admin.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Mock decryption since the server-side decrypt is simple
const crypto = require('crypto');
const ALGORITHM = 'aes-256-cbc';
const KEY = crypto.scryptSync('seetharamapuram-secure-key-2026', 'panchayat-salt', 32);

function decrypt(text) {
  if (!text || !text.includes(':')) return text;
  try {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return text;
  }
}

function decryptObj(obj, keys) {
  const newObj = { ...obj };
  keys.forEach(k => {
    if (newObj[k]) {
      newObj[k] = decrypt(newObj[k]);
    }
  });
  return newObj;
}

const realGrievances = Object.values(db.grievances).map(ticket => 
  decryptObj(ticket, ['name', 'phone', 'desc'])
);

// Set up virtual console
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on('error', (err) => {
  console.error('Console Error:', err.message, err.stack);
});
virtualConsole.on('warn', (msg) => {
  console.warn('Console Warning:', msg);
});
virtualConsole.on('log', (msg) => {
  console.log('Console Log:', msg);
});

// Mock fetch
const dom = new JSDOM(html, {
  url: 'http://localhost/admin.html',
  runScripts: 'dangerously',
  resources: 'usable',
  virtualConsole,
  beforeParse(window) {
    // Mock sessionStorage
    window.sessionStorage.setItem('panchayat-role', 'admin');

    // Mock fetch
    window.fetch = (url) => {
      console.log('Mock Fetch called for:', url);
      if (url === '/api/grievances') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(realGrievances)
        });
      }
      if (url === '/api/household-updates') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            totalUpdates: 10,
            percentages: {
              privateToilet: 90,
              cleanEnergy: 80,
              tapWater: 70,
              ownHouse: 60,
              vehicle: 50
            }
          })
        });
      }
      if (url === '/api/main-page-config') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(db.mainPageConfig)
        });
      }
      if (url === '/api/ration/list') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: '369805471203', owner: 'Sravan Malla', status: 'ACTIVE' }
          ])
        });
      }
      return Promise.reject(new Error('Unknown url: ' + url));
    };

    // Mock scrollIntoView since jsdom doesn't implement it
    window.Element.prototype.scrollIntoView = function() {};
  }
});

// Trigger DOMContentLoaded
const window = dom.window;
const document = window.document;
const event = document.createEvent('Event');
event.initEvent('DOMContentLoaded', true, true);
document.dispatchEvent(event);

console.log('Triggering switchAdminTab("editor")...');
try {
  window.switchAdminTab('editor');
} catch (err) {
  console.error('Error switching tab:', err);
}

// Give a small delay for promises to resolve
setTimeout(() => {
  console.log('JSDOM load finished.');
}, 500);
