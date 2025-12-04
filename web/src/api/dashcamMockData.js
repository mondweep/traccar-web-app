/**
 * Mock Dashcam Data Service
 *
 * Provides realistic mock data for the DashcamDashboard component
 * Useful for testing and visualization without a real backend
 */

// Generate mock telemetry data with realistic values
export const mockTelemetryData = {
  deviceId: 1,
  deviceName: 'C6-Dashcam-001',
  timestamp: new Date().toISOString(),
  latitude: 40.7128,
  longitude: -74.0060,
  altitude: 15.5,
  speed: Math.floor(Math.random() * 80) + 20, // 20-100 km/h
  heading: Math.floor(Math.random() * 360),
  mileage: 15234.5,
  rpm: Math.floor(Math.random() * 3000) + 1000,
  batteryVoltage: 13.8 + (Math.random() * 1.2 - 0.6),
  recording: true,
  storageUsage: Math.random() * 100,
  temperature: 65 + (Math.random() * 15),
  vin: 'WBADT43452G296706',
  fuelConsumption: 7.2,
};

// Mock safety events with realistic scenarios
export const mockEventsData = [
  {
    eventId: 1,
    type: 'harshBraking',
    severity: 'critical',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(), // 2 min ago
    latitude: 40.7128,
    longitude: -74.0060,
    details: 'Deceleration: 8.5 m/s² (Emergency stop detected)',
  },
  {
    eventId: 2,
    type: 'harshAcceleration',
    severity: 'warning',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 min ago
    latitude: 40.7135,
    longitude: -74.0080,
    details: 'Acceleration: 7.2 m/s² (Rapid acceleration from traffic light)',
  },
  {
    eventId: 3,
    type: 'laneDeparture',
    severity: 'warning',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(), // 12 min ago
    latitude: 40.7140,
    longitude: -74.0095,
    details: 'Lane departure warning (driver corrected)',
  },
  {
    eventId: 4,
    type: 'speeding',
    severity: 'info',
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(), // 18 min ago
    latitude: 40.7145,
    longitude: -74.0110,
    details: 'Speed exceeded: 85 km/h in 60 km/h zone',
  },
  {
    eventId: 5,
    type: 'harshTurning',
    severity: 'warning',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(), // 25 min ago
    latitude: 40.7150,
    longitude: -74.0125,
    details: 'Harsh turn detected: 7.8 m/s² lateral acceleration',
  },
  {
    eventId: 6,
    type: 'collisionRisk',
    severity: 'critical',
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(), // 35 min ago
    latitude: 40.7155,
    longitude: -74.0140,
    details: 'Forward collision risk detected (object at 15m)',
  },
  {
    eventId: 7,
    type: 'driverFatigue',
    severity: 'warning',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 min ago
    latitude: 40.7160,
    longitude: -74.0155,
    details: 'Driver fatigue detected (high blink rate)',
  },
  {
    eventId: 8,
    type: 'phoneUsage',
    severity: 'info',
    timestamp: new Date(Date.now() - 55 * 60000).toISOString(), // 55 min ago
    latitude: 40.7165,
    longitude: -74.0170,
    details: 'Driver phone usage detected (hands-off wheel)',
  },
  {
    eventId: 9,
    type: 'pedestrianDetected',
    severity: 'warning',
    timestamp: new Date(Date.now() - 62 * 60000).toISOString(), // 62 min ago
    latitude: 40.7170,
    longitude: -74.0185,
    details: 'Pedestrian detected in driving path (distance: 20m)',
  },
  {
    eventId: 10,
    type: 'harshBraking',
    severity: 'warning',
    timestamp: new Date(Date.now() - 75 * 60000).toISOString(), // 75 min ago
    latitude: 40.7175,
    longitude: -74.0200,
    details: 'Deceleration: 6.8 m/s² (Traffic congestion)',
  },
];

// Mock driver metrics
export const mockMetricsData = {
  safetyScore: 72,
  eventsToday: 6,
  harshAccelerations: 2,
  harshBrakings: 3,
  laneDepartures: 1,
  speeding: 1,
  collisionRisks: 1,
  driverFatigue: 0,
  phoneUsage: 1,
  averageSpeed: 48.5,
  maxSpeed: 92,
  minSpeed: 15,
  tripDuration: 245, // minutes
  distance: 156.3, // km
  comparison: {
    safetyScoreAboveAverage: 12, // % above fleet average
    eventsAboveAverage: -8, // % below fleet average
  },
};

// Simulate real-time data updates
export const generateRealtimeUpdate = () => {
  return {
    ...mockTelemetryData,
    timestamp: new Date().toISOString(),
    speed: Math.floor(Math.random() * 80) + 20,
    heading: Math.floor(Math.random() * 360),
    storageUsage: Math.max(0, Math.min(100, mockTelemetryData.storageUsage + (Math.random() * 2 - 1))),
    temperature: 65 + (Math.random() * 15),
    batteryVoltage: 13.8 + (Math.random() * 1.2 - 0.6),
  };
};

/**
 * Mock API functions that return promises (mimicking real API calls)
 */
export const mockDashcamApi = {
  fetchDashcamTelemetry: () => new Promise(resolve => {
    setTimeout(() => resolve(generateRealtimeUpdate()), 500);
  }),

  fetchDashcamEvents: (options = {}) => new Promise(resolve => {
    setTimeout(() => {
      const limit = options.limit || 10;
      resolve(mockEventsData.slice(0, limit));
    }, 300);
  }),

  fetchDashcamMetrics: (options = {}) => new Promise(resolve => {
    setTimeout(() => resolve(mockMetricsData), 400);
  }),

  fetchDashcams: () => new Promise(resolve => {
    setTimeout(() => resolve([
      {
        id: 1,
        name: 'C6-Dashcam-001',
        deviceId: 1,
        category: 'camera',
        status: 'online',
        lastPosition: { latitude: 40.7128, longitude: -74.0060 },
        lastUpdate: new Date().toISOString(),
      },
    ]), 200);
  }),

  fetchDashcam: (id) => new Promise(resolve => {
    setTimeout(() => resolve({
      id,
      name: `C6-Dashcam-${id}`,
      deviceId: id,
      category: 'camera',
      status: 'online',
      lastPosition: { latitude: 40.7128, longitude: -74.0060 },
      lastUpdate: new Date().toISOString(),
      config: {
        modelName: 'Streamax C6 Lite 2.0-S',
        serialNumber: 'C6LITE232' + String(id).padStart(4, '0'),
        firmwareVersion: '1.5.2',
        gpsEnabled: true,
        cellularEnabled: true,
      },
    }), 200);
  }),

  sendDashcamCommand: (id, command, params = {}) => new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Command '${command}' sent successfully`,
        command,
        deviceId: id,
        timestamp: new Date().toISOString(),
      });
    }, 600);
  }),
};

export default mockDashcamApi;
