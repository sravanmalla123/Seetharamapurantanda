const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const htmlPath = path.join(__dirname, 'public', 'admin.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on('error', (err) => {
  console.error('JSDOM Script Error:', err);
});
virtualConsole.on('warn', (msg) => {
  console.warn('JSDOM Warning:', msg);
});
virtualConsole.on('log', (msg) => {
  console.log('JSDOM Log:', msg);
});

const dom = new JSDOM(html, {
  url: 'http://localhost/admin.html',
  runScripts: 'dangerously',
  resources: 'usable',
  virtualConsole,
  beforeParse(window) {
    window.sessionStorage.setItem('panchayat-role', 'admin');
    
    // Mock fetch to resolve correctly
    window.fetch = (url) => {
      console.log('Fetch called:', url);
      if (url === '/api/grievances') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        });
      }
      if (url === '/api/household-updates') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            totalUpdates: 0,
            percentages: {
              privateToilet: 0,
              cleanEnergy: 0,
              tapWater: 0,
              ownHouse: 0,
              vehicle: 0
            }
          })
        });
      }
      if (url === '/api/main-page-config') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            bannerAlert: { active: false, type: 'info', message: { en: '', hi: '', te: '' } },
            hero: { title: { en: '', hi: '', te: '' }, tagline: { en: '', hi: '', te: '' }, description: { en: '', hi: '', te: '' } },
            stats: { population: {}, families: {}, literacy: {}, occupation: {} },
            budget: { water: {}, roads: {}, forest: {}, transit: {} },
            contacts: { secretary: {}, sarpanch: {}, address: {}, timing: {} },
            profileCounts: {},
            pillars: { health: {}, infra: {}, water: {}, energy: {}, materials: {}, social: {}, green: {} },
            history: { title: {}, p1: {}, p2: {}, p3: {}, p4: {} },
            infraAudit: { roads: {}, drainage: {}, streetlights: {}, bus: {}, halls: {}, office: {} },
            waterDashboard: { supplyHours: {}, weeklyLimit: {}, borewellStatus: {}, fluorideLevel: {}, lastLabDate: {}, alertBanner: {}, infraDetails: { sources: { title: {}, desc: {} }, tanks: { title: {}, desc: {} }, shortages: { title: {}, desc: {} } } },
            agriDashboard: { cropsGrown: {}, irrigationMethods: {}, fertilizerUsage: {}, govSchemes: {}, crops: { paddy: { name: {}, type: {}, period: {}, water: {}, subsidy: {}, msp: {}, notes: {} }, maize: { name: {}, type: {}, period: {}, water: {}, subsidy: {}, msp: {}, notes: {} }, chili: { name: {}, type: {}, period: {}, water: {}, subsidy: {}, msp: {}, notes: {} }, pulses: { name: {}, type: {}, period: {}, water: {}, subsidy: {}, msp: {}, notes: {} } } },
            healthDashboard: { facilities: { subcenter: {}, phc: {}, asha: {}, ambulance: {} }, hygiene: { toilets: {}, odf: {}, waste: {}, plastic: {} }, campaigns: { vax: { title: {}, desc: {} }, camps: { title: {}, desc: {} } } },
            gallery: [],
            notices: [],
            faqs: []
          })
        });
      }
      return Promise.reject(new Error('Unknown url: ' + url));
    };

    window.Element.prototype.scrollIntoView = function() {};
  }
});

// Trigger DOMContentLoaded
const window = dom.window;
const document = window.document;
const event = document.createEvent('Event');
event.initEvent('DOMContentLoaded', true, true);
document.dispatchEvent(event);

console.log('Switching to editor tab...');
try {
  window.switchAdminTab('editor');
} catch (e) {
  console.error('Exception switching tab:', e);
}

setTimeout(() => {
  console.log('JSDOM test complete.');
  process.exit(0);
}, 1000);
