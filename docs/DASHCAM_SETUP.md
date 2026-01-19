# C6 Lite 2.0-S Dashcam Setup Guide

## Quick Start Setup

### Step 1: Configure Camera Network

1. **Connect to Camera WiFi**:
   ```
   SSID: STREAMAX-XXXXXX (where XXXXXX is the last 6 digits of serial)
   ```

2. **Access Camera Web Interface**:
   - Open browser and navigate to: `http://192.168.1.1`
   - Default login credentials (check physical camera sticker)

3. **Configure Server Connection**:
   - Navigate to: Network Settings > Server Configuration
   - Set the following parameters:
     - **Server Protocol**: TCP
     - **Server Address**: `your-traccar-server-ip` (e.g., 192.168.1.100)
     - **Server Port**: `23913`
     - **Device ID**: Camera serial number (must match Traccar device entry)
     - **Enable GPS**: ON
     - **Enable Cellular**: ON (for 4G/LTE connectivity)

4. **Security Settings**:
   - Enable TLS: ON
   - Enable Encryption: AES-256
   - Heartbeat Interval: 30-60 seconds
   - Data Update Interval: 5-10 seconds

### Step 2: Register Device in Traccar

1. **Via Web Interface**:
   - Go to Settings → Devices
   - Click "Add Device"
   - Fill in:
     - **Name**: C6-Dashcam-001 (or your naming convention)
     - **Unique ID**: Camera serial number (must match camera config)
     - **Protocol**: streamax
     - **Category**: camera

2. **Via API**:
   ```bash
   curl -X POST http://localhost:8082/api/devices \
     -H "Content-Type: application/json" \
     -d '{
       "name": "C6-Dashcam-001",
       "uniqueId": "YOUR_CAMERA_SERIAL",
       "category": "camera",
       "attributes": {
         "protocol": "streamax"
       }
     }'
   ```

### Step 3: Verify Connection

1. **Check Traccar Logs**:
   ```bash
   tail -f /path/to/traccar/logs/traccar.log | grep -i streamax
   ```

   Look for messages like:
   ```
   [streamax] Device registered: device_id=123, serial=XXXXX
   [streamax] Position received: lat=40.7128, lon=-74.0060, speed=45
   ```

2. **Check Database**:
   ```sql
   SELECT * FROM positions
   WHERE device_id = (SELECT id FROM devices WHERE unique_id = 'YOUR_CAMERA_SERIAL')
   ORDER BY server_time DESC LIMIT 5;
   ```

3. **Access Web Dashboard**:
   - Navigate to: http://localhost:5173/#/dashcam/123
   - Should see:
     - Camera location on map
     - Real-time telemetry (speed, heading, mileage)
     - Safety events feed
     - Driver metrics

## Troubleshooting

### Camera Won't Connect to Server

**Symptoms**:
- Camera shows "offline" in Traccar
- No position data appearing in database

**Solutions**:
1. Verify network connectivity from camera:
   ```bash
   ping your-traccar-server-ip
   ```

2. Check firewall rules:
   ```bash
   # On Traccar server, verify port 23913 is open
   sudo netstat -tlnp | grep 23913
   ```

3. Verify camera configuration:
   - Check that server IP and port are correct
   - Ensure device ID matches Traccar registration
   - Check camera logs in web interface

4. Restart services:
   ```bash
   # Restart Traccar
   sudo systemctl restart traccar

   # Restart camera (power cycle)
   ```

### No GPS Data

**Symptoms**:
- Position data has coordinates but they're 0,0
- GPS field shows "No Fix"

**Solutions**:
1. Allow time for GPS lock (2-3 minutes outdoors)
2. Check GPS settings in camera web interface:
   - Settings → Location → GPS Mode: Enabled
3. Verify antenna is properly connected (outdoor preferred)
4. Check signal strength indicator in camera settings
5. Wait for clear sky view (avoid tunnels, underground parking)

### Missing Safety Events

**Symptoms**:
- Dashcam data arriving but no safety events in database
- Harsh braking/acceleration not detected

**Solutions**:
1. Check ADAS features enabled:
   - Settings → Safety → Enable ADAS: ON
   - Settings → Safety → Enable DSM: ON
2. Adjust sensitivity levels if events are too frequent
3. Verify accelerometer calibration in camera
4. Check event type filter in dashboard (may be filtering them out)

### High Storage Usage

**Symptoms**:
- Database growing rapidly
- Slow queries on dashcam_events table

**Solutions**:
1. Enable event retention policy:
   ```xml
   <!-- In traccar.xml -->
   <entry key='dashcam.events.retention'>7776000000</entry>  <!-- 90 days -->
   ```

2. Configure archival for old events:
   ```sql
   -- Archive events older than 90 days
   INSERT INTO dashcam_events_archive
   SELECT * FROM dashcam_events
   WHERE event_time < NOW() - INTERVAL '90 days';

   DELETE FROM dashcam_events
   WHERE event_time < NOW() - INTERVAL '90 days';
   ```

## Advanced Configuration

### Custom Event Types

To add custom safety event types, edit:
```
server/src/main/java/org/traccar/handler/events/DashcamEventHandler.java
```

Example:
```java
// Add new event type
if (position.getDouble("customMetric") > threshold) {
    createEvent(position, "customEvent", position.getDouble("customMetric"));
}
```

### Event Severity Mapping

Configure event severity in:
```
server/config/dashcam-events.properties
```

### Integration with Existing Systems

The dashcam data integrates with:
- **Geofencing**: Use geofence events with dashcam location
- **Notifications**: Send alerts on critical safety events
- **Reports**: Generate behavior reports based on dashcam events
- **API**: Consume dashcam data via REST API

## Performance Tuning

### Database Optimization

1. **Add indexes** for common queries:
   ```sql
   CREATE INDEX idx_dashcam_events_device_time
   ON dashcam_events(device_id, event_time DESC);

   CREATE INDEX idx_dashcam_events_severity
   ON dashcam_events(severity);
   ```

2. **Partition events table** for large deployments:
   ```sql
   -- Partition by month
   ALTER TABLE dashcam_events PARTITION BY RANGE (MONTH(event_time));
   ```

### Network Optimization

1. **Reduce data frequency** for less critical cameras:
   ```
   Camera Setting: Data Update Interval: 30 seconds (instead of 5-10)
   ```

2. **Enable data compression** (if supported by camera):
   ```
   Camera Setting: Network → Compression: ON
   ```

## Security Hardening

1. **Use VPN for remote cameras**:
   - Configure camera to connect via VPN tunnel
   - Encrypt all data in transit

2. **Implement API authentication**:
   ```
   All dashcam API endpoints require valid JWT token
   ```

3. **Restrict video access**:
   - Only authorized users can retrieve video files
   - Implement role-based access control

4. **Enable audit logging**:
   ```
   Log all API calls, downloads, and configuration changes
   ```

## Monitoring and Alerts

### Set Up Alerts

1. **Critical Events** (auto-notify):
   ```
   Camera Offline > 5 minutes
   Harsh Acceleration/Braking
   Collision Risk Detected
   Driver Fatigue Detected
   ```

2. **Configure Notifications**:
   - Email alerts for safety events
   - SMS for critical incidents
   - In-app notifications in real-time

### Monitoring Dashboard

Monitor fleet-wide metrics:
- Total cameras online/offline
- Average safety score
- Event frequency
- Driver behavior trends

Access via: Settings → Dashcam Fleet Dashboard

## API Examples

### Get Camera Telemetry
```bash
curl http://localhost:8082/api/dashcams/123/telemetry \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Response:
{
  "deviceId": 123,
  "timestamp": "2024-01-01T12:00:00Z",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "speed": 45,
  "heading": 90,
  "mileage": 15234.5,
  "batteryVoltage": 13.8,
  "recording": true,
  "storageUsage": 65.5
}
```

### Get Recent Safety Events
```bash
curl http://localhost:8082/api/dashcams/123/events?limit=20 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Response:
[
  {
    "eventId": 1,
    "type": "harshBraking",
    "severity": "warning",
    "timestamp": "2024-01-01T11:55:30Z",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "details": "Deceleration: 8.2 m/s²"
  },
  ...
]
```

### Capture Snapshot
```bash
curl -X POST http://localhost:8082/api/dashcams/123/command \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"command": "snapshot"}'

# Response:
{
  "success": true,
  "message": "Snapshot captured",
  "fileId": "20240101_120000_snapshot"
}
```

## Web UI Routes

Available dashboard routes:
- `/main` - Map view (select camera from device list)
- `/dashcam` - Dashcam dashboard home
- `/dashcam/123` - Specific camera dashboard
- `/dashcam/events` - Fleet-wide events viewer
- `/dashcam/analytics` - Driver behavior analytics
- `/reports/driver-behavior` - Detailed driver reports
- `/reports/fleet-metrics` - Fleet metrics and KPIs

## Maintenance

### Regular Tasks

1. **Weekly**:
   - Check camera online status
   - Review critical safety events
   - Monitor storage usage

2. **Monthly**:
   - Update camera firmware (if available)
   - Clean camera lens and casing
   - Review and archive old events

3. **Quarterly**:
   - Verify GPS accuracy with known locations
   - Audit safety event detection thresholds
   - Review retention policies

### Backup Strategy

1. **Database Backups**:
   ```bash
   # Daily backup
   mysqldump traccar > /backup/traccar_$(date +%Y%m%d).sql
   ```

2. **Video File Backups**:
   ```bash
   # Sync to external storage
   rsync -av /var/traccar/media/dashcam/ /backup/dashcam/
   ```

## Support

For issues and support:
- Traccar Forums: https://www.traccar.org/forums/
- Streamax Support: support@streamax.com
- GitHub Issues: https://github.com/traccar/traccar/issues

## Additional Resources

- [Streamax C6 Lite Manual](http://en.streamax.com/productdetail/56.html)
- [Traccar Documentation](https://www.traccar.org/documentation/)
- [Traccar API Documentation](https://www.traccar.org/api/)
- [FleetSafe.AI Platform](https://fleetsafe.ai/)

---

**Last Updated**: December 4, 2024
**Version**: 1.0
