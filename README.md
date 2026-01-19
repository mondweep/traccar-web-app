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
*   **Infrastructure as Code:** Included `setup-azure-backend.sh` to automate the provisioning of the Ubuntu server, including Java 17 installation, firewall configuration (UFW/Azure NSG), and systemd service creation.

## Device Connection Quick Reference

| Device / App | Protocol | Port | Connection Host |
| :--- | :--- | :--- | :--- |
| **Streamax Dashcam** | `streamax` | **23913** | `20.108.17.147` |
| **Traccar Client (Phone)** | `osmand` | **5055** | `20.108.17.147` |
| **Teltonika Tracker** | `teltonika` | **5027** | `20.108.17.147` |

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

- Traccar Core Team: [traccar.org](https://www.traccar.org)
- Original Authors:
  - Anton Tananaev ([anton@traccar.org](mailto:anton@traccar.org))
  - Andrey Kunitsyn ([andrey@traccar.org](mailto:andrey@traccar.org))

## License

Apache License, Version 2.0
