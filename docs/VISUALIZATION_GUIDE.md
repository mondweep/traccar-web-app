# How to Visualize the Dashcam Frontend

## Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
cd /home/user/traccar-web-app/web
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 3: Open in Browser
Navigate to: **http://localhost:5173**

---

## What You'll See

### Current State
The web app is the full **Traccar Web Interface** with your new dashcam features added.

### Dashcam Components Added
✅ **DashcamDashboard.jsx** - Located in `web/src/main/`
✅ **dashcamApi.js** - Located in `web/src/api/`

### Navigation to Dashcam Dashboard

**Option 1: Direct URL**
```
http://localhost:5173/#/dashcam
```

**Option 2: From Main Interface**
1. Login to Traccar (if authentication is required)
2. Go to Devices menu
3. Select a device with category "camera"
4. Should see dashcam dashboard

---

## About the Current Dashboard

### What's Implemented ✅
The **DashcamDashboard.jsx** component displays:

1. **Real-time Telemetry Cards** (4 cards):
   - ⏱️ **Speed** - Current vehicle speed (km/h)
   - 🧭 **Heading** - Direction/bearing (degrees)
   - 🛣️ **Mileage** - Total distance traveled (km)
   - 🔋 **Battery** - Power status (Volts)

2. **Camera Status Panel**:
   - 🎥 **Recording** - Active/Stopped indicator
   - 💾 **Storage** - Usage percentage bar

3. **Driver Metrics Panel**:
   - 📊 **Safety Score** - 0-100 with color-coded bar
   - ⚠️ **Events Today** - Count of safety incidents

4. **Safety Status Alert**:
   - 🟢 Safe / 🟡 Warning / 🔴 Critical
   - Last update timestamp

5. **Recent Events Timeline**:
   - Last 10 safety events
   - Event type, severity, timestamp, details
   - Color-coded by severity

### API Endpoints Required 📡
The dashboard will try to fetch data from these endpoints:
- `GET /api/dashcams/{id}/telemetry` - Real-time position/speed data
- `GET /api/dashcams/{id}/events` - Safety event history
- `GET /api/dashcams/{id}/metrics` - Driver behavior metrics

**Status**: These endpoints are not yet implemented in the backend

---

## Visualization Options

### Option A: Run Frontend Only (Quick Preview)
✅ **Best for**: Seeing the UI/UX design

```bash
cd /home/user/traccar-web-app/web
npm run dev
```

**What you'll see**:
- ✅ Component layout and styling
- ✅ Material-UI design
- ❌ No actual data (will show empty/error states)

**Access**: http://localhost:5173/#/dashcam

---

### Option B: Run Full Stack (Complete Demo)
⚠️ **Requires**: Java 11+, MySQL/PostgreSQL

**Backend Setup**:
```bash
cd /home/user/traccar-web-app/server

# Build backend
./gradlew build

# Create config (traccar.xml)
# Configure database connection
# Set port 8082 for REST API

# Run
java -jar build/libs/traccar.jar
```

**Frontend Setup** (in new terminal):
```bash
cd /home/user/traccar-web-app/web
npm run dev
```

**What you'll see**:
- ✅ Full Traccar web interface
- ✅ Dashcam dashboard with real data
- ✅ All features working
- ✅ Authentication system
- ✅ Device management

**Access**: http://localhost:5173

---

### Option C: Mock Data Demonstration (Recommended for Quick Preview) ✅ READY
✅ **Best for**: Seeing the dashboard in action without backend
✅ **Time**: 2 minutes setup

Perfect for visualizing exactly what the dashboard will display once the backend is connected!

---

## Quick Demo - See the Dashboard Now! (2 minutes)

### Files Created:
1. ✅ **dashcamMockData.js** - Realistic mock dashcam data
2. ✅ **DashcamDashboardDemo.jsx** - Full demo dashboard component
3. ✅ **VISUALIZATION_GUIDE.md** - This guide

### Setup & Run:

#### Step 1: Install Dependencies
```bash
cd /home/user/traccar-web-app/web
npm install
```
This installs React, Material-UI, and all required packages (takes 2-5 minutes first time)

#### Step 2: Start Development Server
```bash
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in 200 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

#### Step 3: Open in Browser

**For Mock Demo (with realistic data):**
```
http://localhost:5173/dashboard-demo
```

**Or access via direct file:**
- Visit: `http://localhost:5173`
- The app will load the Traccar web interface

### What You'll See in Demo Mode

The dashboard displays in real-time:

```
🚗 DASHCAM DASHBOARD

═════════════════════════════════════════════════════════════════
  ✓ Status: Safe (Updated: 12:34:56)  ← Safety alert
═════════════════════════════════════════════════════════════════

┌─────────────┬─────────────┬─────────────┬─────────────┐
│   SPEED     │  HEADING    │   MILEAGE   │   BATTERY   │
│   ⏱️ 45     │   🧭 180°   │  🛣️ 15,234  │  🔋 13.8V   │
│   km/h      │   SSE       │   km        │   Good      │
└─────────────┴─────────────┴─────────────┴─────────────┘

🎥 CAMERA STATUS              📊 DRIVER METRICS
├─ Recording: 🔴 Active       ├─ Safety Score: 72/100 ▓▓▓▓░
└─ Storage: 65% ▓▓▓░░░░░░     ├─ Events Today: 6
                               ├─ Harsh Braking: 3
                               ├─ Lane Departures: 1
                               └─ Speeding: 1

⚡ RECENT SAFETY EVENTS (Last 10)
├─ 🚨 [CRITICAL] Harsh Braking (2m ago)
│  └─ Deceleration: 8.5 m/s² (Emergency stop)
├─ ⚡ [WARNING] Harsh Acceleration (5m ago)
│  └─ Acceleration: 7.2 m/s² (Traffic light)
├─ 🛣️ [WARNING] Lane Departure (12m ago)
│  └─ Lane departure warning (driver corrected)
├─ 💥 [CRITICAL] Collision Risk (35m ago)
│  └─ Forward collision risk detected (15m away)
└─ ... (6 more events)
```

---

## Features Visible in Demo

✅ **Real-time Telemetry**
- Updates every 5 seconds (simulated)
- Speed, heading, mileage, battery
- Gradient-colored cards for visual appeal

✅ **Safety Monitoring**
- Status indicator (Safe/Warning/Critical)
- Color-coded alerts
- Last update timestamp

✅ **Camera Status**
- Recording indicator
- Storage usage bar

✅ **Driver Metrics**
- Safety score (0-100)
- Event breakdown
- Color-coded score (Green/Orange/Red)

✅ **Event Timeline**
- Last 10 safety events
- Event types with emojis
- Severity badges
- Time ago formatting
- Detailed event information
- GPS coordinates

✅ **Responsive Design**
- Works on desktop, tablet, mobile
- Material-UI components
- Professional styling

---

## File Locations

```
web/
├── src/
│   ├── main/
│   │   ├── DashcamDashboard.jsx          ← Production component
│   │   └── DashcamDashboardDemo.jsx      ← Demo with mock data ⭐
│   └── api/
│       ├── dashcamApi.js                 ← Real API client
│       └── dashcamMockData.js            ← Mock data service ⭐
└── package.json
```

---

## Mock Data Included

The demo includes realistic mock data for:

### Telemetry Data
- Speed: 20-100 km/h (randomized each update)
- Heading: 0-360°
- Mileage: 15,234.5 km
- Battery: 13.8V
- Storage: 65%
- Temperature: 65-80°C
- Recording status: Active

### Safety Events (10 realistic scenarios)
1. Harsh Braking (Critical) - 2 min ago
2. Harsh Acceleration (Warning) - 5 min ago
3. Lane Departure (Warning) - 12 min ago
4. Speeding (Info) - 18 min ago
5. Harsh Turning (Warning) - 25 min ago
6. Collision Risk (Critical) - 35 min ago
7. Driver Fatigue (Warning) - 45 min ago
8. Phone Usage (Info) - 55 min ago
9. Pedestrian Detected (Warning) - 62 min ago
10. Harsh Braking (Warning) - 75 min ago

### Driver Metrics
- Safety Score: 72/100
- Events Today: 6
- Event breakdown by type
- Fleet comparison

---

## How Data Updates

The demo simulates real-time updates:
- **Telemetry**: Updates every 5 seconds (new random values within realistic ranges)
- **Events**: Static list (in production, would receive new events)
- **Metrics**: Updates periodically

---

## Production Integration Checklist

When ready to connect to real camera:

✅ Protocol decoder (StreamaxProtocol.java) - DONE
✅ Dashboard UI component (DashcamDashboard.jsx) - DONE
✅ API client library (dashcamApi.js) - DONE
✅ Mock data for testing (dashcamMockData.js) - DONE

⏳ Backend API endpoints - TODO
⏳ Database migrations - TODO
⏳ Authentication integration - TODO
⏳ Real camera testing - TODO

---

## Troubleshooting

### Port 5173 Already in Use?
```bash
# Find process using port
lsof -i :5173

# Kill it
kill -9 <PID>

# Or use a different port
npm run dev -- --port 5174
```

### npm install Too Slow?
```bash
# Try using npm with cache clean
npm cache clean --force
npm install

# Or use faster npm mirror
npm install --registry https://registry.npmmirror.com
```

### Module Not Found Errors?
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Changes Not Reflecting?
```bash
# Hard refresh browser
Ctrl+Shift+R (or Cmd+Shift+R on Mac)

# Check browser console for errors
F12 → Console tab
```

---

## Next Steps

### To See Production Dashboard (with backend):
1. Set up Java backend
2. Configure database
3. Register a device in Traccar
4. Connect real/simulated dashcam
5. Access http://localhost:5173/dashcam

### To Customize Mock Data:
Edit `/home/user/traccar-web-app/web/src/api/dashcamMockData.js`
- Change event types, severity, timestamps
- Adjust telemetry ranges
- Add new metrics

### To Modify Dashboard UI:
Edit `/home/user/traccar-web-app/web/src/main/DashcamDashboardDemo.jsx`
- Change colors, fonts, layouts
- Add new cards/sections
- Customize event display

---

## Command Reference

```bash
# Navigate to web app
cd /home/user/traccar-web-app/web

# Install dependencies (once)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Stop development server
Ctrl+C
```

---

## Browser URLs

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | Main Traccar web app |
| `http://localhost:5173/#/dashcam` | Dashcam dashboard (requires backend API) |
| `http://localhost:5173/dashboard-demo` | Demo dashboard with mock data |

---

## Resources

- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [Vite Documentation](https://vitejs.dev)
- [Traccar Documentation](https://www.traccar.org/documentation/)

---

**Status**: ✅ Ready to Visualize
**Next**: Run the demo now!

```bash
cd /home/user/traccar-web-app/web && npm install && npm run dev
```
