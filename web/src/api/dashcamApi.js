/**
 * Dashcam API Service
 *
 * Provides methods for interacting with Streamax C6 Lite dashcam
 * endpoints in the Traccar backend.
 */

/**
 * Fetch list of all registered dashcams
 */
export const fetchDashcams = async () => {
  const response = await fetch('/api/dashcams');
  if (!response.ok) throw new Error('Failed to fetch dashcams');
  return response.json();
};

/**
 * Fetch specific dashcam details
 * @param {number} dashcamId - The dashcam device ID
 */
export const fetchDashcam = async (dashcamId) => {
  const response = await fetch(`/api/dashcams/${dashcamId}`);
  if (!response.ok) throw new Error('Failed to fetch dashcam');
  return response.json();
};

/**
 * Fetch real-time telemetry data for a dashcam
 * @param {number} dashcamId - The dashcam device ID
 */
export const fetchDashcamTelemetry = async (dashcamId) => {
  const response = await fetch(`/api/dashcams/${dashcamId}/telemetry`);
  if (!response.ok) throw new Error('Failed to fetch telemetry');
  return response.json();
};

/**
 * Fetch safety events for a dashcam
 * @param {number} dashcamId - The dashcam device ID
 * @param {object} options - Query options (limit, offset, startTime, endTime, eventType)
 */
export const fetchDashcamEvents = async (dashcamId, options = {}) => {
  const params = new URLSearchParams();
  if (options.limit) params.append('limit', options.limit);
  if (options.offset) params.append('offset', options.offset);
  if (options.startTime) params.append('startTime', options.startTime);
  if (options.endTime) params.append('endTime', options.endTime);
  if (options.eventType) params.append('eventType', options.eventType);
  if (options.severity) params.append('severity', options.severity);

  const response = await fetch(`/api/dashcams/${dashcamId}/events?${params}`);
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
};

/**
 * Fetch driver metrics and behavior analysis
 * @param {number} dashcamId - The dashcam device ID
 * @param {object} options - Query options (period: 'daily', 'weekly', 'monthly')
 */
export const fetchDashcamMetrics = async (dashcamId, options = {}) => {
  const params = new URLSearchParams();
  if (options.period) params.append('period', options.period);

  const response = await fetch(`/api/dashcams/${dashcamId}/metrics?${params}`);
  if (!response.ok) throw new Error('Failed to fetch metrics');
  return response.json();
};

/**
 * Send command to dashcam (capture snapshot, control recording, etc.)
 * @param {number} dashcamId - The dashcam device ID
 * @param {string} command - Command type ('snapshot', 'startRecord', 'stopRecord', 'alert', etc.)
 * @param {object} params - Command parameters
 */
export const sendDashcamCommand = async (dashcamId, command, params = {}) => {
  const response = await fetch(`/api/dashcams/${dashcamId}/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command, ...params }),
  });
  if (!response.ok) throw new Error('Failed to send command');
  return response.json();
};

/**
 * Update dashcam configuration
 * @param {number} dashcamId - The dashcam device ID
 * @param {object} config - Configuration options
 */
export const updateDashcamConfig = async (dashcamId, config) => {
  const response = await fetch(`/api/dashcams/${dashcamId}/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!response.ok) throw new Error('Failed to update config');
  return response.json();
};

/**
 * Capture snapshot from dashcam
 * @param {number} dashcamId - The dashcam device ID
 */
export const captureDashcamSnapshot = async (dashcamId) => {
  return sendDashcamCommand(dashcamId, 'snapshot');
};

/**
 * Start recording on dashcam
 * @param {number} dashcamId - The dashcam device ID
 * @param {object} options - Recording options (duration, quality, etc.)
 */
export const startDashcamRecording = async (dashcamId, options = {}) => {
  return sendDashcamCommand(dashcamId, 'startRecord', options);
};

/**
 * Stop recording on dashcam
 * @param {number} dashcamId - The dashcam device ID
 */
export const stopDashcamRecording = async (dashcamId) => {
  return sendDashcamCommand(dashcamId, 'stopRecord');
};

/**
 * Send alert to dashcam driver
 * @param {number} dashcamId - The dashcam device ID
 * @param {string} message - Alert message
 * @param {string} severity - Severity level ('info', 'warning', 'critical')
 */
export const sendDriverAlert = async (dashcamId, message, severity = 'warning') => {
  return sendDashcamCommand(dashcamId, 'alert', { message, severity });
};

/**
 * Fetch driver behavior report
 * @param {object} options - Report options (period, driverId, startDate, endDate)
 */
export const fetchDriverBehaviorReport = async (options = {}) => {
  const params = new URLSearchParams();
  if (options.period) params.append('period', options.period);
  if (options.driverId) params.append('driverId', options.driverId);
  if (options.startDate) params.append('startDate', options.startDate);
  if (options.endDate) params.append('endDate', options.endDate);

  const response = await fetch(`/api/reports/driver-behavior?${params}`);
  if (!response.ok) throw new Error('Failed to fetch report');
  return response.json();
};

/**
 * Fetch fleet-wide metrics
 * @param {object} options - Report options (period, startDate, endDate)
 */
export const fetchFleetMetrics = async (options = {}) => {
  const params = new URLSearchParams();
  if (options.period) params.append('period', options.period);
  if (options.startDate) params.append('startDate', options.startDate);
  if (options.endDate) params.append('endDate', options.endDate);

  const response = await fetch(`/api/reports/fleet-metrics?${params}`);
  if (!response.ok) throw new Error('Failed to fetch metrics');
  return response.json();
};

/**
 * Register new dashcam device
 * @param {object} deviceConfig - Device configuration
 */
export const registerDashcam = async (deviceConfig) => {
  const response = await fetch('/api/dashcams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deviceConfig),
  });
  if (!response.ok) throw new Error('Failed to register dashcam');
  return response.json();
};

/**
 * Update dashcam device information
 * @param {number} dashcamId - The dashcam device ID
 * @param {object} deviceInfo - Updated device information
 */
export const updateDashcam = async (dashcamId, deviceInfo) => {
  const response = await fetch(`/api/dashcams/${dashcamId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deviceInfo),
  });
  if (!response.ok) throw new Error('Failed to update dashcam');
  return response.json();
};

/**
 * Delete/unregister dashcam
 * @param {number} dashcamId - The dashcam device ID
 */
export const deleteDashcam = async (dashcamId) => {
  const response = await fetch(`/api/dashcams/${dashcamId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete dashcam');
  return response.ok;
};

export default {
  fetchDashcams,
  fetchDashcam,
  fetchDashcamTelemetry,
  fetchDashcamEvents,
  fetchDashcamMetrics,
  sendDashcamCommand,
  updateDashcamConfig,
  captureDashcamSnapshot,
  startDashcamRecording,
  stopDashcamRecording,
  sendDriverAlert,
  fetchDriverBehaviorReport,
  fetchFleetMetrics,
  registerDashcam,
  updateDashcam,
  deleteDashcam,
};
