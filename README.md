# Traccar GPS Tracking Platform - Monorepo

This is a unified repository containing both the **Traccar Backend Server** and **Traccar Web Interface**, customized for creating a complete GPS tracking demonstration with dashcam integration.

## Repository Structure

```
├── web/                  # Traccar Web Interface (React + Vite) - Deployed to Netlify
├── server/               # Traccar Backend Server (Java) - Deployed to Azure VM
├── docs/                 # Project Documentation & Guides
├── setup-azure-backend.sh # Automated script to provision the Azure VM
└── README.md             # This file
```

## Project Customizations & Features

We have customized the standard Traccar platform for our specific deployment needs and added specific capabilities:

### 1. Hybrid Deployment Architecture
*   **Split Frontend/Backend:** Unlike the standard monolithic deployment, we deploy the Frontend to **Netlify** for performance and correct caching, while the Backend runs on **Azure Linux VMs** for raw TCP socket handling.
*   **API Proxying:** The Netlify frontend proxies API requests (`/api/*`) securely to the Azure backend IP.

### 2. Streamax Dashcam Integration (Active)
*   **Protocol Support:** We explicitly enable and configure the `Streamax` protocol (Port 23913) for dashcam integration.
*   **Custom Decoder:** Modified `StreamaxProtocolDecoder.java` to support video event handling and specific device telemetry.
*   **Visualization:** Custom dashboard elements to display video status and events.

### 3. Teltonika Fleet Support (Active)
*   **Protocol Support:** Full binary protocol support for Teltonika FMB/FMC/FMM series devices.
*   **Ports:** Active and listening on TCP Port 5027.

### 4. Personal Tracking (Active)
*   **Mobile App Support:** Android/iOS "Traccar Client" app support enabled.
*   **Ports:** Active and listening on TCP Port 5055.

### 5. Automated Provisioning
*   **Infrastructure as Code:** Included `scripts/setup-azure-backend.sh` to automate the provisioning of the Ubuntu server, including Java 17 installation, firewall configuration (UFW/Azure NSG), and systemd service creation.

## Device Connection Quick Reference

| Device / App | Protocol | Port | Connection Host |
| :--- | :--- | :--- | :--- |
| **Streamax Dashcam** | `streamax` | **23913** | `20.108.17.147` |
| **Traccar Client (Phone)** | `osmand` | **5055** | `20.108.17.147` |
| **Teltonika Tracker** | `teltonika` | **5027** | `20.108.17.147` |

## Recently Solved Issues & Troubleshooting

### 1. Teltonika Devices (Port 5027)
*   **Symptom:** Device logs show `WARN: Unknown device - [ID]` and device stays Offline.
*   **Cause:** The Traccar server caches device IDs. If you add a device in the UI *after* the device has already tried to connect, the server might not recognize it immediately.
*   **Fix:**
    1.  Ensure the "Identifier" in the UI exactly matches the ID in the logs.
    2.  **Restart the Traccar Service** (`systemctl restart traccar`) to force a cache refresh.
*   **Symptom:** Device stays offline after restart.
*   **Fix:** Teltonika devices often sleep to save data. **Move the device** (shake or drive) to trigger the accelerometer and force a data packet.

### 2. Traccar Client / Phone App (Port 5055)
*   **Symptom:** Phone shows as "Offline" (Grey) after a server redeploy.
*   **Cause:** Connection is one-way (Phone -> Server). The server cannot "ping" the phone. The "Online" status is reset on server restart.
*   **Fix:** No action needed on server. Force "Send Location" from the app or wait for the user to move.

### 3. Streamax Dashcams (Port 23913)
*   **Status:** **Partial Connectivity (Debugging)**.
*   **Progress:**
    *   Fixed `traccar.xml` missing port configuration.
    *   Updated `StreamaxProtocolDecoder` to handle custom JSON handshake.
    *   Implemented binary header response to match device expectations.
*   **Current State:** Device connects, shakes hands, but disconnects shortly after. Optimization of the keep-alive/response logic is ongoing.

## Documentation Index

All detailed guides are located in the [`docs/`](./docs/) directory.

### 🚀 Getting Started
*   [**Team Onboarding**](./docs/TEAM_ONBOARDING.md) - **Start Here.** Connection details, ports, and high-level architecture diagram.
*   [**Deployment Guide**](./docs/DEPLOYMENT_GUIDE.md) - Complete manual for deploying the frontend to Netlify and backend to Azure.

### 🎥 Dashcam Integration
*   [**Dashcam Integration Overview**](./docs/DASHCAM_INTEGRATION.md) - Detailed breakdown of the Streamax integration logic and video flow.
*   [**Dashcam Implementation Summary**](./docs/DASHCAM_IMPLEMENTATION_SUMMARY.md) - Technical summary of the implemented Java/React code changes.
*   [**Dashcam Setup**](./docs/DASHCAM_SETUP.md) - Specific configuration steps for the Application Processor.
*   [**Visualization Guide**](./docs/VISUALIZATION_GUIDE.md) - Explains the custom visual indicators (icons, video status) in the UI.

## Quick Start

### Web Interface

Navigate to the web directory and install dependencies:

```bash
cd web
npm install
npm run dev
# The dev server will proxy requests to the Azure Backend IP defined in vite.config.js
```

### Backend Server

Navigate to the server directory and build:

```bash
cd server
./gradlew build
```

## Technology Stack

### Web Interface
- React 19+
- Material UI (MUI)
- MapLibre (for mapping)
- Vite (build tool)

### Backend
- Java 17
- Gradle (build system)
- RESTful API
- WebSocket for real-time updates
- H2 Database (File-based for simple portability)

## Team

- Current Project:
  - Mondweep Chakravorty ([LinkedIn](https://www.linkedin.com/in/mondweepchakravorty/))

- Original Authors (Traccar):
  - Anton Tananaev ([anton@traccar.org](mailto:anton@traccar.org))
  - Andrey Kunitsyn ([andrey@traccar.org](mailto:andrey@traccar.org))

## License

Apache License, Version 2.0
