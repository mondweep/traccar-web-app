# Traccar Connectivity Debugging Walkthrough

## 🎯 Goal
Diagnose and fix connectivity issues for multiple devices:
1.  **Streamax Dashcam**: Stuck in handshake/disconnect loop.
2.  **Teltonika Tracker**: Showing "Offline" or "Unknown Device".
3.  **Phone Client**: Going offline after server restarts.
4.  **Frontend**: WebSocket connection failures.

## 🛠️ Key Fixes Implemented

### 1. Frontend WebSocket Fix
*   **Issue:** `WebSocket connection failed`.
*   **Fix:** Updated `netlify.toml` to reorder redirect rules. Prioritized `/api/socket` proxying over the generic `/api/*` wildcard rule to prevent WebSocket traffic from being mishandled.

### 2. Streamax Dashcam (Port 23913)
*   **Issue:** Device was connecting but getting rejected or disconnecting immediately.
*   **Fixes:**
    1.  **Backend Config:** Added `<entry key="streamax.port">23913</entry>` to `traccar.xml` on Azure.
    2.  **Handshake Logic:** Updated `StreamaxProtocolDecoder.java` to detect the `CONNECT` JSON operation.
    3.  **Binary Response:** Implemented a specific 12-byte binary header + JSON payload response to satisfy the device's proprietary handshake requirement.
    4.  **Terminator:** Added a `0x0a` (newline) terminator to the response packet.
*   **Status:** **Connected & Handshaking**. The server now correctly responds to the device. The session is paused pending further protocol verification by the user's team.

### 3. Teltonika Tracker (Port 5027)
*   **Issue:** Device offline, logs showing "Unknown device".
*   **Fixes:**
    1.  **Verified Ports:** Confirmed port 5027 was open and listening on Azure.
    2.  **Cache Refresh:** Restarted the `traccar` service (`systemctl restart traccar`) to force the server to recognize the newly added Device ID.
    3.  **Wake-up:** User moved the device to trigger the accelerometer, forcing a data packet transmission.
*   **Status:** **ONLINE**. Device is successfully tracking.

### 4. Code & Documentation
*   **Cleanup:** Removed unused imports to fix compilation warnings.
*   **Documentation:** Updated `README.md` with a new "Troubleshooting" section covering these specific scenarios.
*   **Deployment:** All changes committed and pushed to GitHub (`claude/init-traccar-repo...` branch).

## 📊 Verification Results

| Device | Status | Port | Notes |
| :--- | :--- | :--- | :--- |
| **Teltonika** | ✅ **ONLINE** | 5027 | Sending valid GPS data. |
| **Phone Client** | ✅ **ONLINE** | 5055 | Works when moving/woken up. |
| **Streamax** | ⚠️ **Scanning** | 23913 | Handshake packet acknowledged. Paused. |

## ⏭️ Next Steps
1.  **User Team:** Verify the exact Streamax protocol version/expectations.
2.  **Next Session:** Resume Streamax debugging if needed, or move to feature development.
