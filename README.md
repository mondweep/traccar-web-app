# Traccar GPS Tracking Platform - Monorepo

This is a unified repository containing both the **Traccar Backend Server** and **Traccar Web Interface** for creating a complete GPS tracking demonstration with dashcam integration.

## Repository Structure

```
├── web/          # Traccar Web Interface (React + Vite)
├── server/       # Traccar Backend Server (Java)
├── README.md     # This file
└── ...
```

## Overview

**Traccar** is an open-source GPS tracking platform. This monorepo integrates:

- **Web Interface** (`/web`) - Modern React-based web dashboard
- **Backend Server** (`/server`) - Java-based GPS tracking server

Together, these provide a complete platform for GPS tracking, vehicle monitoring, and dashcam integration.

## Quick Start

### Web Interface

Navigate to the web directory and install dependencies:

```bash
cd web
npm install
npm run dev  # For development
npm run build  # For production
```

For detailed build instructions, see [web/README.md](./web/README.md) or visit [traccar.org/build-web-app](https://www.traccar.org/build-web-app/)

### Backend Server

Navigate to the server directory and build:

```bash
cd server
./gradlew build
```

For detailed instructions, see [server/README.md](./server/README.md)

## Dashcam Demonstration

This integrated setup enables a comprehensive dashcam demonstration:

1. **GPS Server** - Tracks vehicle location and telemetry data
2. **Web Dashboard** - Displays real-time vehicle positions and dashcam integration
3. **Data Integration** - Connects GPS tracking with dashcam video streams

### Setup Steps

1. Start the backend server from the `/server` directory
2. Configure the web interface to connect to your server
3. Add GPS devices (dashcams or GPS trackers)
4. View real-time tracking in the web dashboard

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
- Java
- Gradle (build system)
- RESTful API
- WebSocket for real-time updates

## Team

- Traccar Core Team: [traccar.org](https://www.traccar.org)
- Original Authors:
  - Anton Tananaev ([anton@traccar.org](mailto:anton@traccar.org))
  - Andrey Kunitsyn ([andrey@traccar.org](mailto:andrey@traccar.org))

## License

Apache License, Version 2.0

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## Contributing

For contributions, features, or issues:
- Check [Traccar GitHub](https://github.com/traccar/traccar)
- Check [Traccar Web GitHub](https://github.com/traccar/traccar-web)
