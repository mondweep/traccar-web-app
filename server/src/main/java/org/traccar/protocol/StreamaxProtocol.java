/*
 * Copyright 2024 Traccar Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.traccar.protocol;

import org.traccar.BaseProtocol;
import org.traccar.PipelineBuilder;
import org.traccar.TrackerServer;
import org.traccar.config.Config;

import jakarta.inject.Inject;

/**
 * Protocol handler for Streamax C6 Lite MDVR dashcam
 *
 * Device: Streamax C6 Lite 2.0-S (232)
 * Connection: TCP/IP on port 23913
 * Protocol: ASCII/JSON Streamax protocol
 *
 * Features:
 * - GPS tracking with Dead Reckoning
 * - Real-time telemetry data (speed, heading, altitude)
 * - Driver behavior monitoring (harsh acceleration, braking, cornering)
 * - Safety event detection (lane departure, collision risk, pedestrian alerts)
 * - Video recording status and metadata
 * - OBD-II data support
 *
 * Data includes 180+ parameters covering:
 * - Vehicle position and movement
 * - Driver status and behavior
 * - Safety events and alerts
 * - Device health and status
 * - Media (video/photo) information
 */
public class StreamaxProtocol extends BaseProtocol {

    @Inject
    public StreamaxProtocol(Config config) {
        // Register TCP server for Streamax protocol
        // Default port: 23913
        addServer(new TrackerServer(config, getName(), false) {
            @Override
            protected void addProtocolHandlers(PipelineBuilder pipeline, Config config) {
                // Add frame decoder to handle message boundaries
                pipeline.addLast(new StreamaxFrameDecoder());

                // Add protocol decoder to parse Streamax messages
                pipeline.addLast(new StreamaxProtocolDecoder(StreamaxProtocol.this));
            }
        });
    }

}
