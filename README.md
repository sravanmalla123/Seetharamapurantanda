# Seetharamapuram Gram Panchayat Portal 🌾💧

Welcome to the official full-stack digital civic node for the Seetharamapuram Gram Panchayat. This portal is designed to bridge rural citizens with transparent local administration, livelihood support systems, public certificate draft generation, and real-time resource tracking.

## 🌟 Key Features

1. **Welcome Splash Screen Transition**:
   - Staggered letter-by-letter reveal animation for `SEETHARAMAPURAM` name with glowing light transitions and gold-liquid chrome gradient.
   - Zero-lag split stripes door-shutter slide effects on load.
2. **Transparent Asset & Green Cover Mapping**:
   - Interactive SVG-based village map tagging neem, teak, and bamboo plantations.
   - Provides live geolocation and audit data for localized shade and climate resilience initiatives.
3. **Live Water Supply & Reservoir Dashboard**:
   - Visual reservoir tank level display alongside fluoridation indices and weekly rationing guidelines.
4. **Welfare Eligibility & Grievance portals**:
   - Multi-tab welfare scheme check tools (Rythu Bandhu, Aasara Pensions, PM-KISAN).
   - Dynamic grievance lodging and status tracking timelines, backed by server storage.
5. **Budget Transparency Chart**:
   - Visual percentage chart of Panchayat budget allocations (Water, Infrastructure, Plantations, Education).
6. **Citizen FAQ & Helpdesk**:
   - Elegant accordion component answering key documentation, timing, and transit pass queries.
7. **Read Progress & Scrolled Header**:
   - Glowing scroll progress bar and scroll-sentinel triggered header transitions to keep navigation accessible and lag-free.

---

## 🛠️ Project Architecture

This application is built as a lightweight, zero-dependency full-stack platform:
- **Frontend**: Vanilla HTML5, CSS3, and ES6+ JavaScript.
- **Backend**: Native Node.js HTTP server ([server.js](server.js)) handling static content rendering and API requests (no Express or external modules required).
- **Database**: Local database storage [db.json](db.json) for complaints registry and ration records.

---

## 📂 Project Structure

```
├── assets/                  # Custom illustrations (Gond murals, housing layouts, mirror weaving)
├── index.html               # Main page layout & modals structure
├── style.css                # Visual themes, layout tokens, and GPU animations
├── app.js                   # Client side controller & API fetch routines
├── server.js                # Native Node.js web server & API router
├── db.json                  # Persistent JSON storage database
├── start_portal.bat         # Double-click launcher for Windows
├── package.json             # NPM metadata and scripts definitions
├── mobile_app/              # Flutter mobile application codebase
│   ├── lib/                 # Dart source files (main, screens, services)
│   └── pubspec.yaml         # Dart dependencies and assets configurations
└── .gitignore               # Standard exclusions schema
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher recommended)

### Quick Run (Windows)
Simply double-click the **`start_portal.bat`** file in the project folder. This will automatically:
1. Open the portal at `http://localhost:8000` in your default browser.
2. Launch the backend server.

### Manual Launch (All Platforms)
1. Open your terminal in the project folder.
2. Start the server using npm:
   ```bash
   npm start
   ```
3. Open your browser and navigate to `http://localhost:8000`.

---

## 📱 Mobile Application (Flutter)

Inside the `mobile_app/` directory is the official Flutter mobile app for Seetharamapuram Gram Panchayat. The app connects to the same Node.js backend.

### Features
1. **Staggered Name Splash Screen**: Smooth letter-by-letter reveal animation mimicking the web portal.
2. **Citizen Services Dashboard**: Material 3 Grid View with direct links to Ration Tracking and Grievances.
3. **Secure Grievance Portal**: Write and track grievance reports with a visual, vertical timeline component showing resolution status.
4. **Ration Card Allocation Check**: Enter a 12-digit Ration ID and instantly pull monthly rice, wheat, and kerosene allocations.
5. **Harmonious Theme**: Built with matching Forest Emerald (`#14281C`), Amber Gold (`#F5A623`), and Mint Green (`#4ABD7E`) palettes.

### Run Instructions
1. Navigate to the mobile app directory:
   ```bash
   cd mobile_app
   ```
2. Retrieve dependencies:
   ```bash
   flutter pub get
   ```
3. Run the application (ensure a mobile device or emulator is running):
   ```bash
   flutter run
   ```
   *Note: In `lib/services/api_service.dart`, the base API URL is configured to `10.0.2.2:8000` to properly route emulator traffic to the host computer's localhost. If testing on a physical device, update the IP address to match your local computer's network IP.*

---

## 🔒 License
This project is licensed under the MIT License.
