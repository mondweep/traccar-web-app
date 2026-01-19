# Traccar GPS Tracking Platform - Monorepo

This is a unified repository containing both the **Traccar Backend Server** and **Traccar Web Interface**, customized for creating a complete GPS tracking demonstration with dashcam integration.

## Repository Structure

```
├── web/                  # Traccar Web Interface (React + Vite) - Deployed to Netlify
├── server/               # Traccar Backend Server (Java) - Deployed to Azure VM
├── TEAM_ONBOARDING.md    # [New] Team guide for architecture and connecting devices
├── DEPLOYMENT_GUIDE.md   # [New] Full guide for deploying to Azure/Netlify
├── setup-azure-backend.sh # [New] Automated script to provision the Azure VM
├── README.md             # This file
└── ...
```

## Project Customizations

We have customized the standard Traccar platform for our specific deployment needs:

### 1. Hybrid Deployment Architecture
*   **Split Frontend/Backend:** Unlike the standard monolithic deployment, we deploy the Frontend to **Netlify** for performance and correct caching, while the Backend runs on **Azure Linux VMs** for raw TCP socket handling.
*   **API Proxying:** The Netlify frontend proxies API requests (`/api/*`) securely to the Azure backend IP.

### 2. Streamax Dashcam Integration
*   **Protocol Support:** We explicitly enable and configure the `Streamax` protocol (Port 23913) for dashcam integration.
*   **Custom Decoder:** Modified `StreamaxProtocolDecoder.java` to support video event handling and specific device telemetry.

### 3. Automated Provisioning
*   **Infrastructure as Code:** Included `setup-azure-backend.sh` to automate the provisioning of the Ubuntu server, including Java 17 installation, firewall configuration (UFW/Azure NSG), and systemd service creation.

## Key Documents

*   [**Team Onboarding & Device Connection**](./TEAM_ONBOARDING.md) - **Start Here.** How to connect phones and dashcams to the platform. Includes the full architecture diagram.
*   [**Deployment Guide**](./DEPLOYMENT_GUIDE.md) - Step-by-step instructions for deploying to production (Netlify + Azure).
*   [**Azure Setup Script**](./setup-azure-backend.sh) - Shell script used to bootstrap the backend server.

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

## Dashcam Demonstration

This integrated setup enables a comprehensive dashcam demonstration:

1. **GPS Server** - Tracks vehicle location and telemetry data
2. **Web Dashboard** - Displays real-time vehicle positions and dashcam integration
3. **Data Integration** - Connects GPS tracking with dashcam video streams

## Documentation

- [Traccar Official Website](https://www.traccar.org)
- [Web App Documentation](https://www.traccar.org/build-web-app/)
- [Backend Documentation](https://www.traccar.org/documentation/)
- [API Documentation](server/openapi.yaml)

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
