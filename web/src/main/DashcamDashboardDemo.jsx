import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Alert,
  Button,
  Stack,
  Container,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Camera as CameraIcon,
  Videocam as VideocamIcon,
  DirectionsCar as CarIcon,
  Speed as SpeedIcon,
  Navigation as NavigationIcon,
  Battery3Bar as BatteryIcon,
} from '@mui/icons-material';
import { mockDashcamApi, mockTelemetryData, mockEventsData, mockMetricsData } from '../api/dashcamMockData';

/**
 * DashcamDashboardDemo Component
 *
 * Demo version of DashcamDashboard that works with mock data
 * Perfect for visualizing the UI/UX without needing a backend
 *
 * Features:
 * - Real-time mock telemetry updates (simulated)
 * - Safety event timeline
 * - Driver metrics display
 * - Full Material-UI styling
 * - Responsive design
 */
const DashcamDashboardDemo = () => {
  const [dashcamData, setDashcamData] = useState(mockTelemetryData);
  const [recentEvents, setRecentEvents] = useState(mockEventsData);
  const [driverMetrics, setDriverMetrics] = useState(mockMetricsData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate real-time telemetry updates
  useEffect(() => {
    const fetchDashcamData = async () => {
      try {
        setLoading(true);
        const data = await mockDashcamApi.fetchDashcamTelemetry();
        setDashcamData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchDashcamData();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchDashcamData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get safety status based on recent events
  const getSafetyStatus = () => {
    if (!recentEvents || recentEvents.length === 0) {
      return { color: 'success', label: 'No Issues', icon: <CheckCircleIcon /> };
    }

    const recentCritical = recentEvents.filter(
      (e) => e.severity === 'critical' && Date.now() - new Date(e.timestamp).getTime() < 60000
    );
    if (recentCritical.length > 0) {
      return { color: 'error', label: 'Critical Alert', icon: <ErrorIcon /> };
    }

    const recentWarning = recentEvents.filter(
      (e) => e.severity === 'warning' && Date.now() - new Date(e.timestamp).getTime() < 300000
    );
    if (recentWarning.length > 0) {
      return { color: 'warning', label: 'Warning', icon: <WarningIcon /> };
    }

    return { color: 'success', label: 'Safe', icon: <CheckCircleIcon /> };
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const safetyStatus = getSafetyStatus();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🚗 Dashcam Dashboard
        </Typography>
        <Typography color="textSecondary" variant="body2">
          C6 Lite 2.0-S Real-time Monitoring (DEMO with Mock Data)
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Safety Status Alert */}
        <Grid item xs={12}>
          <Alert
            severity={safetyStatus.color}
            icon={safetyStatus.icon}
            action={
              <Button color="inherit" size="small">
                View Details
              </Button>
            }
          >
            <strong>Status:</strong> {safetyStatus.label}
            {dashcamData?.timestamp && ` (Updated: ${new Date(dashcamData.timestamp).toLocaleTimeString()})`}
          </Alert>
        </Grid>

        {/* Real-time Telemetry Grid */}
        {dashcamData && (
          <>
            {/* Speed */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
                        Speed
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {Math.round(dashcamData.speed)}
                      </Typography>
                      <Typography variant="caption">km/h</Typography>
                    </Box>
                    <SpeedIcon sx={{ fontSize: 48, opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Heading */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
                        Heading
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {Math.round(dashcamData.heading)}°
                      </Typography>
                      <Typography variant="caption">
                        {dashcamData.heading < 90 ? 'NE' : dashcamData.heading < 180 ? 'SE' : dashcamData.heading < 270 ? 'SW' : 'NW'}
                      </Typography>
                    </Box>
                    <NavigationIcon sx={{ fontSize: 48, opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Mileage */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
                        Mileage
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {dashcamData.mileage.toFixed(0)}
                      </Typography>
                      <Typography variant="caption">km</Typography>
                    </Box>
                    <CarIcon sx={{ fontSize: 48, opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Battery */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background:
                    dashcamData.batteryVoltage > 13
                      ? 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
                      : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  color: 'white',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
                        Battery
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {dashcamData.batteryVoltage.toFixed(1)}V
                      </Typography>
                      <Typography variant="caption">
                        {dashcamData.batteryVoltage > 13 ? 'Good' : 'Low'}
                      </Typography>
                    </Box>
                    <BatteryIcon sx={{ fontSize: 48, opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Camera Recording Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, background: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              🎥 Camera Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box
                  sx={{
                    p: 1.5,
                    border: '2px solid #ddd',
                    borderRadius: 1,
                    backgroundColor: 'white',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <VideocamIcon color={dashcamData?.recording ? 'error' : 'disabled'} />
                    <Box>
                      <Typography variant="caption">Recording</Typography>
                      <Chip
                        label={dashcamData?.recording ? '🔴 Active' : '⏹ Stopped'}
                        color={dashcamData?.recording ? 'error' : 'default'}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    p: 1.5,
                    border: '2px solid #ddd',
                    borderRadius: 1,
                    backgroundColor: 'white',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <CameraIcon color="primary" />
                    <Box flex={1}>
                      <Typography variant="caption">Storage Usage</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                        {Math.round(dashcamData?.storageUsage || 0)}%
                      </Typography>
                      <LinearProgress variant="determinate" value={dashcamData?.storageUsage || 0} sx={{ mt: 0.5 }} />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Driver Metrics */}
        {driverMetrics && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, background: '#f5f5f5' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                📊 Driver Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ p: 1.5, border: '2px solid #ddd', borderRadius: 1, backgroundColor: 'white' }}>
                    <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                      Safety Score
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      {driverMetrics.safetyScore}/100
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={driverMetrics.safetyScore}
                      sx={{
                        mt: 1,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor:
                            driverMetrics.safetyScore >= 80
                              ? '#4caf50'
                              : driverMetrics.safetyScore >= 60
                              ? '#ff9800'
                              : '#f44336',
                        },
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1.5, border: '2px solid #ddd', borderRadius: 1, backgroundColor: 'white' }}>
                    <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                      Events Today
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                      {driverMetrics.eventsToday}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {driverMetrics.eventsToday > 0 && (
                        <Chip label={`⚠️ ${driverMetrics.eventsToday} incidents`} size="small" color="error" variant="outlined" />
                      )}
                      {driverMetrics.eventsToday === 0 && (
                        <Chip label="✓ No incidents" size="small" color="success" variant="outlined" />
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              {/* Event breakdown */}
              <Box sx={{ mt: 2, p: 1, backgroundColor: '#fff3e0', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }} display="block" gutterBottom>
                  Event Breakdown:
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="caption">🚨 Harsh Braking: {driverMetrics.harshBrakings}</Typography>
                  <Typography variant="caption">⚡ Harsh Acceleration: {driverMetrics.harshAccelerations}</Typography>
                  <Typography variant="caption">🛣️ Lane Departure: {driverMetrics.laneDepartures}</Typography>
                  <Typography variant="caption">📉 Speeding: {driverMetrics.speeding}</Typography>
                  <Typography variant="caption">💥 Collision Risk: {driverMetrics.collisionRisks}</Typography>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Recent Safety Events */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, background: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              ⚡ Recent Safety Events (Last 10)
            </Typography>
            <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
              {recentEvents && recentEvents.length > 0 ? (
                <Stack spacing={1}>
                  {recentEvents.map((event, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 1.5,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        borderLeft: `4px solid ${
                          event.severity === 'critical'
                            ? '#f44336'
                            : event.severity === 'warning'
                            ? '#ff9800'
                            : '#4caf50'
                        }`,
                        backgroundColor: 'white',
                        '&:hover': { backgroundColor: '#fafafa', boxShadow: 1 },
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {event.type === 'harshBraking' && '🚨 Harsh Braking'}
                            {event.type === 'harshAcceleration' && '⚡ Harsh Acceleration'}
                            {event.type === 'laneDeparture' && '🛣️ Lane Departure'}
                            {event.type === 'speeding' && '📉 Speeding'}
                            {event.type === 'collisionRisk' && '💥 Collision Risk'}
                            {event.type === 'driverFatigue' && '😴 Driver Fatigue'}
                            {event.type === 'phoneUsage' && '📱 Phone Usage'}
                            {event.type === 'pedestrianDetected' && '👤 Pedestrian Detected'}
                            {event.type === 'harshTurning' && '🔄 Harsh Turning'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {formatTimeAgo(event.timestamp)} • {new Date(event.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                        <Chip
                          label={event.severity.toUpperCase()}
                          size="small"
                          color={
                            event.severity === 'critical'
                              ? 'error'
                              : event.severity === 'warning'
                              ? 'warning'
                              : 'success'
                          }
                          variant="filled"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                      {event.details && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#666' }}>
                          {event.details}
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#999' }}>
                        📍 {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography color="textSecondary">No events recorded</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Demo Info */}
        <Grid item xs={12}>
          <Alert severity="info">
            <strong>Demo Mode:</strong> This dashboard is displaying mock data. In production, it will connect to real
            dashcam devices via the Streamax protocol on port 23913. Telemetry updates every 5 seconds (simulated).
          </Alert>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashcamDashboardDemo;
