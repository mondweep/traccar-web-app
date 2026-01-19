# C6 Lite 2.0-S (232) Dashcam Integration Guide

## Overview

This document outlines the integration of the **Streamax C6 Lite 2.0-S (232) dashcam** with the Traccar GPS tracking platform. The C6 Lite is a professional-grade dashcam with built-in GPS, 4G/LTE connectivity, and comprehensive telematics capabilities.

## Camera Specifications

### Device Information
- **Manufacturer**: Streamax Technology Co., Ltd.
- **Model**: C6 Lite 2.0-S (232)
- **(232)** = RS-232 serial interface variant
- **Class**: Professional MDVR (Mobile Digital Video Recorder)

### Key Features
- **Video**: 1080P UHD, 143° ultra-wide field of view
- **GPS**: Built-in with Dead Reckoning (EC25-AF module)
- **Connectivity**:
  - 4G/LTE cellular
  - WiFi for local configuration
  - RS-232 serial interface
  - CAN bus (alternative model)
- **Storage**: Dual 256GB Micro SD card slots
- **AI Safety Features**:
  - ADAS (Advanced Driver Assistance System)
  - DSM (Driver Status Monitoring)
  - Real-time dangerous driving detection
  - Lane departure warnings
  - Pedestrian detection
- **Sensors**: 6-axis gravity sensor for driving events
- **Audio**: Two-way communication with noise cancellation

## Streamax Protocol

### Protocol Details
- **Name**: Streamax Protocol
- **Type**: ASCII/TCP over IP
- **Default Port**: 23913
- **Encryption**: TLS 1.3, AES-256
- **Data Format**: JSON objects with 180+ parameters

### Data Transmitted
1. **GPS Telemetry**:
   - Coordinates (latitude/longitude)
   - Altitude, heading, speed
   - Satellite count
   - Position accuracy (DOP)

2. **Vehicle Metrics**:
   - Mileage
   - Fuel level/temperature
   - RPM, engine load
   - Battery voltage
   - OBD-II data (if available)

3. **Driver Monitoring**:
   - Driver fatigue detection
   - Phone usage detection
   - Distraction warnings
   - Driver status

4. **Safety Events**:
   - Harsh acceleration/braking
   - Harsh cornering
   - Collision detection
   - Lane departure events
   - Pedestrian alerts
   - Forward collision warnings

5. **Device Status**:
   - Video recording status
   - Storage usage
   - Alarm events
   - Device temperature
   - Power status

6. **Media**:
   - Photo capture capability
   - Video file metadata
   - Event recordings

## Integration Architecture

### Recommended Approach: Hybrid Integration

```
┌─────────────────────────────────────────────────────────────┐
│                   C6 Lite 2.0-S (232)                       │
│                   (Streamax MDVR Camera)                    │
└──────────────┬────────────────────────────┬─────────────────┘
               │ Streamax Protocol          │ WiFi/Config
               │ TCP 23913                  │ Local Setup
               │                            │
        ┌──────▼──────┐            ┌────────▼────────┐
        │ Flespi MQTT │            │ Mobile App      │
        │ /REST API   │            │ (Remote Config) │
        └──────┬──────┘            └─────────────────┘
               │
               │ Parsed Data
               │ (MQTT/REST)
               │
        ┌──────▼──────────────────────────────┐
        │  Traccar Backend                     │
        │  ┌─────────────────────────────────┐ │
        │  │ StreamaxProtocol Handler        │ │
        │  │ - TCP Server (Port 23913)       │ │
        │  │ - Protocol Decoder              │ │
        │  │ - Position Storage              │ │
        │  └─────────────────────────────────┘ │
        │  ┌─────────────────────────────────┐ │
        │  │ Camera Media Manager            │ │
        │  │ - Video Storage                 │ │
        │  │ - Photo Access                  │ │
        │  │ - Remote Commands               │ │
        │  └─────────────────────────────────┘ │
        └──────┬───────────────────────────────┘
               │
        ┌──────▼──────────────────────────────┐
        │  Traccar Web Interface              │
        │  ┌─────────────────────────────────┐ │
        │  │ Dashcam Dashboard Component    │ │
        │  │ - Live GPS Tracking             │ │
        │  │ - Video Feed Display            │ │
        │  │ - Driver Behavior Analytics     │ │
        │  │ - Safety Event Alerts           │ │
        │  │ - Telemetry Metrics             │ │
        │  └─────────────────────────────────┘ │
        └─────────────────────────────────────┘
```

### Integration Paths

#### Option 1: Direct Traccar Integration (Recommended for MVP)
- Camera → Traccar TCP Server (Port 23913)
- Streamax protocol decoder in backend
- Positional data stored in database
- Basic video/photo metadata support
- **Pros**: Simpler, direct control, full database integration
- **Cons**: Limited video streaming without additional work

#### Option 2: Through Flespi (Recommended for Production)
- Camera → Flespi Gateway → Traccar (via MQTT/REST)
- Flespi handles protocol parsing
- Flespi manages video/media assets
- Traccar consumes clean positional data
- **Pros**: Better separation of concerns, proven integration, video support
- **Cons**: Additional dependency, subscription-based service

#### Option 3: Hybrid Approach (Best)
- Direct integration to Traccar for GPS tracking
- Flespi integration for video/media assets
- Best of both worlds

## Implementation Roadmap

### Phase 1: Backend Protocol Support (Week 1)
**Objective**: Enable Traccar to receive and parse Streamax protocol data

**Tasks**:
1. Create `StreamaxProtocol.java`
   - Extends `BaseProtocol`
   - Configures TCP server on port 23913
   - Registers protocol handlers

2. Create `StreamaxProtocolDecoder.java`
   - Parses ASCII/TCP Streamax messages
   - Extracts position, telemetry, and event data
   - Returns Position objects

3. Create `StreamaxFrameDecoder.java` (if needed)
   - Handles frame boundaries
   - Message parsing logic

4. Register protocol in config/Keys.java
   - Add protocol identifier
   - Port configuration

5. Create database models for dashcam data
   - DashcamEvent model
   - DriverMetrics model
   - SafetyAlert model

**Files to Create**:
```
server/src/main/java/org/traccar/protocol/
  ├── StreamaxProtocol.java
  ├── StreamaxProtocolDecoder.java
  └── StreamaxFrameDecoder.java

server/src/main/java/org/traccar/model/
  ├── DashcamDevice.java
  ├── DashcamEvent.java
  ├── DriverMetrics.java
  └── SafetyAlert.java
```

### Phase 2: Web Interface Components (Week 2)
**Objective**: Create UI components for dashcam monitoring

**Tasks**:
1. Create DashcamDashboard component
   - Real-time camera location on map
   - Video feed placeholder
   - Live telemetry display

2. Create DashcamEvents component
   - Timeline of safety events
   - Event filtering and search
   - Severity indicators

3. Create DriverMetrics component
   - Driving behavior analytics
   - Speed analytics
   - Safety score

4. Create AlertPanel component
   - Real-time safety alerts
   - Event notifications
   - Alert management

**Files to Create**:
```
web/src/
  ├── main/DashcamDashboard.jsx
  ├── main/DashcamEvents.jsx
  ├── reports/DriverMetricsReport.jsx
  ├── common/components/
  │   └── AlertPanel.jsx
  └── api/dashcamApi.js
```

### Phase 3: API & Database Integration (Week 2-3)
**Objective**: Create REST APIs and database schema

**Tasks**:
1. Create DashcamResource API
   - GET /api/dashcams - List dashcams
   - GET /api/dashcams/{id} - Get camera details
   - POST /api/dashcams/{id}/command - Send commands
   - GET /api/dashcams/{id}/events - Get events

2. Create DashcamEventResource API
   - Query safety events
   - Filter by type, severity, time range

3. Create database migration
   - dashcam_devices table
   - dashcam_events table
   - driver_metrics table
   - safety_alerts table

4. Update Device model
   - Add camera-specific properties
   - Video storage configuration
   - Event recording settings

**Files to Create**:
```
server/src/main/java/org/traccar/api/resource/
  ├── DashcamResource.java
  ├── DashcamEventResource.java
  └── DriverMetricsResource.java

server/schema/
  └── changelog-dashcam.xml (liquibase migration)
```

### Phase 4: Testing & Documentation (Week 3-4)
**Objective**: Verify integration and create documentation

**Tasks**:
1. Unit tests for protocol decoder
2. Integration tests for camera connection
3. API endpoint tests
4. End-to-end testing with actual camera
5. Performance testing
6. Documentation and user guide

## Camera Configuration

### Network Setup
1. **Connect to Camera WiFi**:
   - SSID: `STREAMAX-XXXXXX` (last 6 digits of serial)
   - Password: Check camera sticker or manual

2. **Access Configuration Interface**:
   - Browser: `192.168.1.1`
   - Default credentials: Check manual

3. **Configure Server Connection**:
   - Server Type: TCP
   - Server IP: Your Traccar server IP
   - Server Port: 23913
   - Device ID/Serial: Camera serial number
   - Enable GPS: ON
   - Enable 4G/LTE: ON

### Advanced Settings
- **Encryption**: Enable TLS 1.3
- **Data Frequency**: 5-10 seconds for real-time tracking
- **Heartbeat**: 30-60 seconds
- **Video Quality**: Adjust based on storage needs
- **Safety Events**: Enable all ADAS features

## Data Storage Strategy

### GPS Positions
- Store in Traccar positions table
- Update interval: Every 10 seconds
- Historical data: Keep indefinitely (configurable)
- Indexing: By device_id, server_time for fast queries

### Safety Events
- New table: dashcam_events
- Event types: Speeding, harsh braking, lane departure, collision risk
- Severity levels: Info, Warning, Critical
- Auto-purge: Keep 30-90 days (configurable)

### Video/Photos
- Store metadata in database
- Video files: Store on separate media server or cloud storage
- Retention: Based on space available
- Access control: User-based permissions

### Driver Metrics
- Aggregate safety events per driver
- Daily/weekly/monthly safety scores
- Behavior trends over time
- Used for performance reviews and insurance

## API Endpoints

### Dashcam Management
```
GET    /api/dashcams              - List all dashcams
GET    /api/dashcams/{id}         - Get specific camera
POST   /api/dashcams              - Register new camera
PUT    /api/dashcams/{id}         - Update settings
DELETE /api/dashcams/{id}         - Unregister camera
```

### Events & Telemetry
```
GET    /api/dashcams/{id}/events  - Get safety events
GET    /api/dashcams/{id}/metrics - Get driver metrics
GET    /api/dashcams/{id}/telemetry - Get real-time telemetry
```

### Remote Control
```
POST   /api/dashcams/{id}/snapshot    - Capture snapshot
POST   /api/dashcams/{id}/record      - Start/stop recording
POST   /api/dashcams/{id}/alert       - Send alert to driver
POST   /api/dashcams/{id}/config      - Update configuration
```

### Reports
```
GET    /api/reports/driver-behavior   - Driver analytics
GET    /api/reports/safety-events     - Safety event summary
GET    /api/reports/fleet-metrics     - Fleet-wide metrics
```

## Web UI Components

### DashcamDashboard
- Map with camera current location
- Real-time speed and heading
- Recent safety events feed
- Driver status indicator
- Video feed thumbnail (placeholder for live stream)
- Quick stats (distance, duration, events today)

### SafetyEventsList
- Chronological event timeline
- Event type badges (Speeding, HarshBrake, LaneDept, etc.)
- Severity color coding
- Event details on click
- Filter by type, severity, date range

### DriverMetricsPanel
- Safety score (0-100)
- Events this period
- Most common violation type
- Comparison to fleet average
- Trend chart

### AlertPanel
- Real-time notifications
- Blinking for critical alerts
- Snooze/dismiss options
- Alert history

## Configuration Files

### Traccar Configuration (traccar.xml)
```xml
<!-- Streamax Protocol -->
<entry key='streamax.port'>23913</entry>
<entry key='streamax.protocol'>streamax</entry>
<entry key='streamax.timeout'>120000</entry>

<!-- Dashcam Settings -->
<entry key='dashcam.events.retention'>7776000000</entry>  <!-- 90 days -->
<entry key='dashcam.media.storage'>/data/dashcam/media</entry>
<entry key='dashcam.video.enabled'>true</entry>
<entry key='dashcam.photos.enabled'>true</entry>
```

### Environment Variables
```bash
# Camera Server
STREAMAX_PORT=23913
STREAMAX_TIMEOUT=120

# Video Storage
DASHCAM_MEDIA_PATH=/data/dashcam/videos
DASHCAM_MEDIA_MAX_SIZE=1000000000000  # 1TB

# Event Retention
DASHCAM_EVENT_RETENTION=7776000000  # 90 days

# Flespi Integration (Optional)
FLESPI_API_TOKEN=your_token_here
FLESPI_DEVICE_ID=camera_id
FLESPI_BROKER=mqtt.flespi.io
```

## Testing the Integration

### Step 1: Verify Protocol Decoder
```bash
# In Traccar server logs, look for:
# "[streamax] Device registered: device_id=XXXXX"
# "[streamax] Position received: lat=XX.XX lon=XX.XX speed=XX"
```

### Step 2: Check Database
```sql
-- Verify positions are stored
SELECT * FROM positions
WHERE device_id = (SELECT id FROM devices WHERE unique_id = 'camera_serial')
ORDER BY server_time DESC LIMIT 10;

-- Check dashcam events
SELECT * FROM dashcam_events
WHERE device_id = XXX
ORDER BY event_time DESC LIMIT 20;
```

### Step 3: Test API Endpoints
```bash
curl http://localhost:8082/api/dashcams

curl http://localhost:8082/api/dashcams/1/events

curl -X POST http://localhost:8082/api/dashcams/1/command \
  -H "Content-Type: application/json" \
  -d '{"command":"snapshot"}'
```

### Step 4: Test Web Dashboard
- Navigate to http://localhost:5173/#/dashcam
- Verify camera appears on map
- Check real-time telemetry updates
- View safety events feed

## Security Considerations

1. **Authentication**:
   - Require API key for camera commands
   - Use JWT tokens for web interface
   - Implement role-based access control

2. **Encryption**:
   - Enforce TLS 1.3 for camera connection
   - Use HTTPS for web interface
   - Encrypt video storage

3. **Access Control**:
   - Only authorized users can view camera data
   - Users can only see assigned cameras
   - Admins can manage camera fleet

4. **Data Privacy**:
   - Comply with privacy regulations (GDPR, CCPA)
   - Allow drivers to request data deletion
   - Implement data anonymization options

5. **Video Security**:
   - Restrict video access by role
   - Audit video access logs
   - Auto-delete old videos

## Troubleshooting

### Camera Won't Connect
1. Verify network connectivity from camera
2. Check firewall rules for port 23913
3. Verify server IP/port configuration in camera
4. Check Traccar server logs for errors
5. Restart camera and server

### Missing GPS Data
1. Ensure GPS is enabled on camera
2. Allow 2-3 minutes for GPS lock
3. Check signal strength in camera settings
4. Verify device permissions in Traccar

### Events Not Appearing
1. Check ADAS/safety features enabled
2. Verify camera sensitivity settings
3. Check database for dashcam_events table
4. Review event filtering criteria

### Video Not Displaying
1. Verify video files exist on storage path
2. Check media storage permissions
3. Ensure video codec is compatible
4. Check browser video support (H.264, VP9)

## References

- [Streamax Technology](http://en.streamax.com/)
- [FleetSafe.AI Dashboard](https://fleetsafe.ai/)
- [Flespi Streamax Integration](https://flespi.com/protocols/streamax)
- [Traccar Documentation](https://www.traccar.org/documentation/)
- [Traccar Protocol Guide](https://www.traccar.org/protocols/)
- [C6 Lite User Manual](http://en.streamax.com/productdetail/56.html)

## Next Steps

1. **Immediate**: Set up camera network connectivity
2. **Week 1**: Implement Streamax protocol decoder in Traccar
3. **Week 2**: Create web UI components
4. **Week 3**: Integrate database and APIs
5. **Week 4**: Testing and deployment

## Support & Community

- Traccar Forums: https://www.traccar.org/forums/
- Streamax Support: support@streamax.com
- GitHub Issues: https://github.com/traccar/traccar/issues

---

**Last Updated**: December 4, 2024
**Version**: 1.0
**Status**: Integration Planning Phase
