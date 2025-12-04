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
import PageLayout from '../common/components/PageLayout';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

/**
 * DashcamDashboard Component
 *
 * Displays real-time monitoring and analytics for Streamax C6 Lite dashcam.
 * Features:
 * - Live GPS tracking on map
 * - Real-time telemetry display
 * - Safety events feed
 * - Driver behavior metrics
 * - Camera status and recording status
 * - Alert notifications
 */
const DashcamDashboard = () => {
  const { id } = useParams();
  const [dashcamData, setDashcamData] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [driverMetrics, setDriverMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashcam telemetry
  useEffect(() => {
    const fetchDashcamData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/dashcams/${id}/telemetry`);
        if (!response.ok) throw new Error('Failed to fetch dashcam data');
        const data = await response.json();
        setDashcamData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Poll for updates every 5 seconds
    fetchDashcamData();
    const interval = setInterval(fetchDashcamData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  // Fetch recent events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/dashcams/${id}/events?limit=10`);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setRecentEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, [id]);

  // Fetch driver metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/dashcams/${id}/metrics`);
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        setDriverMetrics(data);
      } catch (err) {
        console.error('Error fetching metrics:', err);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [id]);

  // Get safety status based on recent events
  const getSafetyStatus = () => {
    if (!recentEvents || recentEvents.length === 0) {
      return { color: 'success', label: 'No Issues', icon: <CheckCircleIcon /> };
    }

    const recentCritical = recentEvents.filter(
      (e) => e.severity === 'critical' && Date.now() - e.timestamp < 60000
    );
    if (recentCritical.length > 0) {
      return { color: 'error', label: 'Critical Alert', icon: <ErrorIcon /> };
    }

    const recentWarning = recentEvents.filter(
      (e) => e.severity === 'warning' && Date.now() - e.timestamp < 300000
    );
    if (recentWarning.length > 0) {
      return { color: 'warning', label: 'Warning', icon: <WarningIcon /> };
    }

    return { color: 'success', label: 'Safe', icon: <CheckCircleIcon /> };
  };

  const safetyStatus = getSafetyStatus();

  if (loading && !dashcamData) {
    return <PageLayout title="Dashcam Dashboard"><LinearProgress /></PageLayout>;
  }

  return (
    <PageLayout title="Dashcam Dashboard">
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
            {/* Speed and Location */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Speed
                      </Typography>
                      <Typography variant="h4">
                        {dashcamData.speed ? Math.round(dashcamData.speed) : 0}
                      </Typography>
                      <Typography variant="caption">km/h</Typography>
                    </Box>
                    <SpeedIcon sx={{ fontSize: 48, color: '#1976d2' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Heading/Direction */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Heading
                      </Typography>
                      <Typography variant="h4">
                        {dashcamData.heading ? Math.round(dashcamData.heading) : 0}°
                      </Typography>
                      <Typography variant="caption">N/S/E/W</Typography>
                    </Box>
                    <NavigationIcon sx={{ fontSize: 48, color: '#388e3c' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Mileage */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Mileage
                      </Typography>
                      <Typography variant="h4">
                        {dashcamData.mileage ? dashcamData.mileage.toFixed(1) : 0}
                      </Typography>
                      <Typography variant="caption">km</Typography>
                    </Box>
                    <CarIcon sx={{ fontSize: 48, color: '#d32f2f' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Battery/Power Status */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Battery
                      </Typography>
                      <Typography variant="h4">
                        {dashcamData.batteryVoltage ? dashcamData.batteryVoltage.toFixed(1) : 0}V
                      </Typography>
                      <Typography variant="caption">
                        {dashcamData.batteryVoltage > 13 ? 'Good' : 'Low'}
                      </Typography>
                    </Box>
                    <BatteryIcon sx={{ fontSize: 48, color: dashcamData.batteryVoltage > 13 ? '#388e3c' : '#d32f2f' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Camera Recording Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Camera Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <VideocamIcon color={dashcamData?.recording ? 'error' : 'disabled'} />
                  <Box>
                    <Typography variant="caption">Recording</Typography>
                    <Chip
                      label={dashcamData?.recording ? 'Active' : 'Stopped'}
                      color={dashcamData?.recording ? 'error' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CameraIcon color="primary" />
                  <Box>
                    <Typography variant="caption">Storage</Typography>
                    <Typography variant="body2">
                      {dashcamData?.storageUsage ? Math.round(dashcamData.storageUsage) : 0}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={dashcamData?.storageUsage || 0}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Driver Metrics */}
        {driverMetrics && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Driver Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Safety Score
                    </Typography>
                    <Typography variant="h5">{driverMetrics.safetyScore}/100</Typography>
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
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Events Today
                    </Typography>
                    <Typography variant="h5">{driverMetrics.eventsToday || 0}</Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                      {driverMetrics.eventsToday > 0 && (
                        <Chip label="⚠" size="small" variant="outlined" />
                      )}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Recent Safety Events */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Events (Last 10)
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
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
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2">{event.type}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                        <Chip
                          label={event.severity}
                          size="small"
                          color={
                            event.severity === 'critical'
                              ? 'error'
                              : event.severity === 'warning'
                              ? 'warning'
                              : 'success'
                          }
                          variant="outlined"
                        />
                      </Box>
                      {event.details && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                          {event.details}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography color="textSecondary">No events recorded</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Error State */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">
              <strong>Error:</strong> {error}
            </Alert>
          </Grid>
        )}
      </Grid>
    </PageLayout>
  );
};

export default DashcamDashboard;
