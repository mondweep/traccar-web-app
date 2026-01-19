# Traccar GPS Tracking Platform - Monorepo

This is a unified repository containing both the **Traccar Backend Server** and **Traccar Web Interface**, customized for creating a complete GPS tracking demonstration with dashcam integration.

## Repository Structure

```
├── web/                  # Traccar Web Interface (React + Vite) - Deployed to Netlify
├── server/               # Traccar Backend Server (Java) - Deployed to Azure VM
├── README.md             # This file
├── TEAM_ONBOARDING.md    # Guide for connecting devices & architecture
└── ... (See Documentation Index below)
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

## Device Capabilities & Port Mapping

Our server supports a wide range of devices. Standard ports must be opened on the Azure Firewall if not already active.

| Device Manufacturer | Protocol | Default Port | Status |
| :--- | :--- | :--- | :--- |
| **Streamax** | `streamax` | **23913** | **ACTIVE** (Open in Firewall) |
| **Traccar Client** | `osmand` | **5055** | **ACTIVE** (Open in Firewall) |
| **Teltonika** | `teltonika` | **5027** | **Supported** (Requires Port Open) |

> [!NOTE]
> **Teltonika Devices:** The platform includes full native support for the entire Teltonika fleet (FMB, FMC, FMM series) via the binary TCP protocol. If you plan to deploy Teltonika units, request port `5027` to be opened.

## Documentation Index

We have extensive documentation covering different aspects of the system:

### 🚀 Getting Started
*   [**Team Onboarding**](./TEAM_ONBOARDING.md) - **Start Here.** Connection details, ports, and high-level architecture.
*   [**Deployment Guide**](./DEPLOYMENT_GUIDE.md) - Production deployment manual for Netlify and Azure.

### 🎥 Dashcam Integration
*   [**Dashcam Integration Overview**](./DASHCAM_INTEGRATION.md) - Detailed breakdown of the Streamax integration logic.
*   [**Dashcam Implementation Summary**](./DASHCAM_IMPLEMENTATION_SUMMARY.md) - Technical summary of the implemented Java/React code.
*   [**Dashcam Setup**](./DASHCAM_SETUP.md) - Specific configuration steps for the Application Processor and devices.
*   [**Visualization Guide**](./VISUALIZATION_GUIDE.md) - Guide to understanding the specific visual indicators in the UI.

### 🛠 Automation
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
