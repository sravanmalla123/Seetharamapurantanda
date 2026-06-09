const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

const PORT = 8000;
const DB_PATH = path.join(__dirname, 'db.json');

// Cryptographically Secure AES-256-CBC Encryption configuration
const ALGORITHM = 'aes-256-cbc';
const KEY = crypto.scryptSync('seetharamapuram-secure-key-2026', 'panchayat-salt', 32);
const IV_LENGTH = 16;

function encrypt(text) {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

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

// Encrypt specific keys of an object
function encryptObj(obj, keys) {
  const newObj = { ...obj };
  keys.forEach(k => {
    if (newObj[k]) {
      newObj[k] = encrypt(newObj[k]);
    }
  });
  return newObj;
}

// Decrypt specific keys of an object
function decryptObj(obj, keys) {
  const newObj = { ...obj };
  keys.forEach(k => {
    if (newObj[k]) {
      newObj[k] = decrypt(newObj[k]);
    }
  });
  return newObj;
}

// Helper to read DB
function readDb() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database:', err);
    return { rationCards: {}, grievances: {}, certificates: {} };
  }
}

// Helper to write DB
function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing database:', err);
  }
}

// Helper to serve static files
function serveStaticFile(res, filePath) {
  const safePath = path.resolve(filePath);
  if (!safePath.startsWith(path.resolve(__dirname))) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  const ext = path.extname(safePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8'
  };

  fs.readFile(safePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content);
    }
  });
}

// Helper to parse JSON body
function getJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    try {
      const db = readDb();

      // GET /api/grievances
      if (pathname === '/api/grievances' && req.method === 'GET') {
        const ticketId = parsedUrl.query.id;
        if (ticketId) {
          const ticket = db.grievances[ticketId];
          if (ticket) {
            // Decrypt on query retrieve
            const decryptedTicket = decryptObj(ticket, ['name', 'phone', 'desc']);
            res.writeHead(200);
            res.end(JSON.stringify(decryptedTicket));
          } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Grievance ticket not found' }));
          }
        } else {
          // Return decrypted values for list lookup
          const decryptedList = Object.values(db.grievances).map(ticket => 
            decryptObj(ticket, ['name', 'phone', 'desc'])
          );
          res.writeHead(200);
          res.end(JSON.stringify(decryptedList));
        }
        return;
      }

      // POST /api/grievances
      if (pathname === '/api/grievances' && req.method === 'POST') {
        const body = await getJsonBody(req);
        const { name, phone, category, desc } = body;

        if (!name || !phone || !category || !desc) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Missing required parameters' }));
          return;
        }

        const randomPart = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
        const ticketId = `GP-2026-${randomPart}`;

        const newGrievance = {
          id: ticketId,
          name,
          phone,
          category,
          desc,
          date: new Date().toLocaleDateString('en-GB'),
          status: 'Submitted',
          assignedTo: 'Shri Narasimha (Panchayat Secretary)',
          history: [
            { status: 'Grievance Submitted', detail: `Registered in GP database by ${name}. ID: ${ticketId}.`, time: 'Just Now' }
          ]
        };

        // Encrypt sensitive fields before saving
        const encryptedGrievance = encryptObj(newGrievance, ['name', 'phone', 'desc']);
        
        db.grievances[ticketId] = encryptedGrievance;
        writeDb(db);

        // Return plaintext representation to caller
        res.writeHead(201);
        res.end(JSON.stringify(newGrievance));
        return;
      }

      // GET /api/ration
      if (pathname === '/api/ration' && req.method === 'GET') {
        const cardId = parsedUrl.query.id;
        if (!cardId) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Missing Ration Card ID parameter' }));
          return;
        }

        const card = db.rationCards[cardId];
        if (card) {
          // Decrypt fields on retrieval
          const decryptedCard = decryptObj(card, ['owner', 'type', 'shop', 'members', 'rice', 'wheat', 'kerosene']);
          res.writeHead(200);
          res.end(JSON.stringify(decryptedCard));
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'Ration card record not found' }));
        }
        return;
      }

      // POST /api/certificates
      if (pathname === '/api/certificates' && req.method === 'POST') {
        const body = await getJsonBody(req);
        const { type, name, idNum, reason } = body;

        if (!type || !name || !idNum || !reason) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Missing required parameters' }));
          return;
        }

        let docName = 'Documents Verification';
        if (type === 'adangal') docName = 'Land Adangal (ROR-1B) Record';
        else if (type === 'birth') docName = 'Birth Registration Certificate';
        else if (type === 'income') docName = 'Resident Income Certification';

        const serial = 'GP-CERT-' + Math.floor(100000 + Math.random() * 900000);
        const date = new Date().toLocaleDateString('en-GB');

        const newCertificate = {
          serial,
          type,
          title: docName,
          name,
          idNum,
          reason,
          date,
          status: 'VERIFIED'
        };

        // Encrypt fields before saving
        const encryptedCertificate = encryptObj(newCertificate, ['name', 'idNum', 'reason']);

        db.certificates[serial] = encryptedCertificate;
        writeDb(db);

        // Return plaintext representation to caller
        res.writeHead(201);
        res.end(JSON.stringify(newCertificate));
        return;
      }
      
      // GET /api/household-updates
      if (pathname === '/api/household-updates' && req.method === 'GET') {
        const updates = db.householdUpdates || {};
        const keys = Object.keys(updates);
        const total = keys.length || 1;
        
        let toiletCount = 0;
        let vehicleCount = 0;
        let tapWaterCount = 0;
        let cleanEnergyCount = 0;
        let ownHouseCount = 0;

        keys.forEach(k => {
          if (updates[k].privateToilet) toiletCount++;
          if (updates[k].vehicle) vehicleCount++;
          if (updates[k].tapWater) tapWaterCount++;
          if (updates[k].cleanEnergy) cleanEnergyCount++;
          if (updates[k].ownHouse) ownHouseCount++;
        });

        res.writeHead(200);
        res.end(JSON.stringify({
          totalUpdates: keys.length,
          stats: {
            privateToilet: toiletCount,
            vehicle: vehicleCount,
            tapWater: tapWaterCount,
            cleanEnergy: cleanEnergyCount,
            ownHouse: ownHouseCount
          },
          percentages: {
            privateToilet: Math.round((toiletCount / total) * 100),
            vehicle: Math.round((vehicleCount / total) * 100),
            tapWater: Math.round((tapWaterCount / total) * 100),
            cleanEnergy: Math.round((cleanEnergyCount / total) * 100),
            ownHouse: Math.round((ownHouseCount / total) * 100)
          }
        }));
        return;
      }

      // POST /api/household-updates
      if (pathname === '/api/household-updates' && req.method === 'POST') {
        const body = await getJsonBody(req);
        const { householdId, privateToilet, vehicle, tapWater, cleanEnergy, ownHouse } = body;

        if (!householdId) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Missing householdId' }));
          return;
        }

        if (!db.householdUpdates) {
          db.householdUpdates = {};
        }

        db.householdUpdates[householdId] = {
          privateToilet: !!privateToilet,
          vehicle: !!vehicle,
          tapWater: !!tapWater,
          cleanEnergy: !!cleanEnergy,
          ownHouse: !!ownHouse
        };

        writeDb(db);

        const updates = db.householdUpdates;
        const keys = Object.keys(updates);
        const total = keys.length || 1;
        
        let toiletCount = 0;
        let vehicleCount = 0;
        let tapWaterCount = 0;
        let cleanEnergyCount = 0;
        let ownHouseCount = 0;

        keys.forEach(k => {
          if (updates[k].privateToilet) toiletCount++;
          if (updates[k].vehicle) vehicleCount++;
          if (updates[k].tapWater) tapWaterCount++;
          if (updates[k].cleanEnergy) cleanEnergyCount++;
          if (updates[k].ownHouse) ownHouseCount++;
        });

        res.writeHead(200);
        res.end(JSON.stringify({
          totalUpdates: keys.length,
          stats: {
            privateToilet: toiletCount,
            vehicle: vehicleCount,
            tapWater: tapWaterCount,
            cleanEnergy: cleanEnergyCount,
            ownHouse: ownHouseCount
          },
          percentages: {
            privateToilet: Math.round((toiletCount / total) * 100),
            vehicle: Math.round((vehicleCount / total) * 100),
            tapWater: Math.round((tapWaterCount / total) * 100),
            cleanEnergy: Math.round((cleanEnergyCount / total) * 100),
            ownHouse: Math.round((ownHouseCount / total) * 100)
          }
        }));
        return;
      }

      // API 404
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'API endpoint not found' }));
      return;

    } catch (err) {
      console.error('API Error:', err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
      return;
    }
  }

  // Static File Serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  serveStaticFile(res, filePath);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at:`);
  console.log(`- http://localhost:${PORT}`);
  console.log(`- http://10.253.91.42:${PORT}`);
});
