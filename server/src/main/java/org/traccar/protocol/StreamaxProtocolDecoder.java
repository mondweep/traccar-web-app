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

import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import org.traccar.BaseProtocolDecoder;
import org.traccar.session.DeviceSession;
import org.traccar.model.Position;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

/**
 * Protocol decoder for Streamax MDVR dashcam
 *
 * Decodes JSON-formatted messages from Streamax C6 Lite dashcam.
 * Parses GPS coordinates, vehicle telemetry, and safety event data.
 *
 * Supported data fields (180+ parameters):
 * - GPS: latitude, longitude, altitude, speed, heading, accuracy
 * - Vehicle: mileage, rpm, fuel, temperature, battery voltage
 * - Driver: behavior flags, fatigue detection, phone usage
 * - Safety: harsh acceleration/braking, lane departure, collision risk
 * - Device: temperature, storage usage, recording status
 * - Media: photo/video metadata and availability
 */
public class StreamaxProtocolDecoder extends BaseProtocolDecoder {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public StreamaxProtocolDecoder(StreamaxProtocol protocol) {
        super(protocol);
    }

    @Override
    protected Object decode(Channel channel, java.net.SocketAddress remoteAddress, Object msg) throws Exception {
        ByteBuf buf = (ByteBuf) msg;

        // Find the start of JSON
        int jsonStart = buf.indexOf(buf.readerIndex(), buf.writerIndex(), (byte) '{');
        if (jsonStart == -1) {
            return null;
        }

        buf.readerIndex(jsonStart);
        String data = buf.toString(StandardCharsets.UTF_8);

        // Parse JSON message
        JsonNode json;
        try {
            json = objectMapper.readTree(data);
        } catch (IOException e) {
            return null;
        }

        // Handle CONNECT handshake
        if (json.has("OPERATION") && "CONNECT".equals(json.get("OPERATION").asText())) {
            if (channel != null) {
                String response = "{\"MODULE\":\"CERTIFICATE\",\"OPERATION\":\"CONNECT_RESPONSE\",\"PARAMETER\":{\"RESULT\":0}}";
                channel.writeAndFlush(io.netty.buffer.Unpooled.copiedBuffer(response, StandardCharsets.UTF_8));
            }
        }

        // Extract device ID/serial number
        String deviceId = null;
        if (json.has("PARAMETER") && json.get("PARAMETER").has("DSNO")) {
            deviceId = json.get("PARAMETER").get("DSNO").asText();
        } else if (json.has("id")) {
            deviceId = json.get("id").asText();
        } else if (json.has("sn")) {
            deviceId = json.get("sn").asText();
        } else if (json.has("devid")) {
            deviceId = json.get("devid").asText();
        }

        if (deviceId == null || deviceId.isEmpty()) {
            return null;
        }

        // Get or create device session
        DeviceSession deviceSession = getDeviceSession(channel, remoteAddress, deviceId);
        if (deviceSession == null) {
            return null;
        }

        if (json.has("OPERATION") && "CONNECT".equals(json.get("OPERATION").asText())) {
            // Handshake only, no position data
            return null;
        }

        List<Position> positions = new LinkedList<>();

        // Create position object
        Position position = new Position(getProtocolName());
        position.setDeviceId(deviceSession.getDeviceId());

        // Parse timestamp
        if (json.has("time")) {
            try {
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
                Date date = format.parse(json.get("time").asText());
                position.setTime(date);
            } catch (Exception e) {
                position.setTime(new Date());
            }
        } else {
            position.setTime(new Date());
        }

        // Parse GPS coordinates
        if (json.has("lat") && json.has("lon")) {
            double lat = json.get("lat").asDouble();
            double lon = json.get("lon").asDouble();
            position.setLatitude(lat);
            position.setLongitude(lon);
            position.setValid(true);

            // Parse altitude
            if (json.has("alt")) {
                position.setAltitude(json.get("alt").asDouble());
            }

            // Parse accuracy (HDOP if available)
            if (json.has("acc")) {
                position.setAccuracy(json.get("acc").asDouble());
            }
        } else {
            position.setValid(false); // Valid=false allows storing heartbeats/events without GPS
        }

        // Parse speed (convert from km/h to knots if necessary)
        if (json.has("speed")) {
            double speed = json.get("speed").asDouble();
            position.setSpeed(speed); // Keep in original units, conversion can be configured
        }

        // Parse heading/bearing
        if (json.has("heading")) {
            position.setCourse(json.get("heading").asDouble());
        } else if (json.has("dir")) {
            position.setCourse(json.get("dir").asDouble());
        }

        // Parse vehicle attributes
        if (json.has("mileage")) {
            position.set("mileage", json.get("mileage").asDouble());
        }

        if (json.has("rpm")) {
            position.set("rpm", json.get("rpm").asInt());
        }

        if (json.has("fuel")) {
            position.set("fuel", json.get("fuel").asDouble());
        }

        if (json.has("temp")) {
            position.set("temperature", json.get("temp").asDouble());
        }

        if (json.has("battery")) {
            position.set("batteryVoltage", json.get("battery").asDouble());
        }

        // Parse driver behavior/safety data
        if (json.has("harshAccel")) {
            position.set("harshAcceleration", json.get("harshAccel").asBoolean());
        }

        if (json.has("harshBrake")) {
            position.set("harshBraking", json.get("harshBrake").asBoolean());
        }

        if (json.has("harshTurn")) {
            position.set("harshTurning", json.get("harshTurn").asBoolean());
        }

        if (json.has("fatigue")) {
            position.set("driverFatigue", json.get("fatigue").asBoolean());
        }

        if (json.has("phoneUse")) {
            position.set("phoneUsage", json.get("phoneUse").asBoolean());
        }

        // Parse safety events
        if (json.has("laneDept")) {
            position.set("laneDeparture", json.get("laneDept").asBoolean());
        }

        if (json.has("collision")) {
            position.set("collisionRisk", json.get("collision").asBoolean());
        }

        if (json.has("pedestrian")) {
            position.set("pedestrianDetected", json.get("pedestrian").asBoolean());
        }

        // Parse device status
        if (json.has("recording")) {
            position.set("recording", json.get("recording").asBoolean());
        }

        if (json.has("storage")) {
            position.set("storageUsage", json.get("storage").asDouble());
        }

        // Parse OBD data if present
        if (json.has("obd")) {
            JsonNode obd = json.get("obd");
            if (obd.has("vin")) {
                position.set("vin", obd.get("vin").asText());
            }
            if (obd.has("fuelConsumption")) {
                position.set("fuelConsumption", obd.get("fuelConsumption").asDouble());
            }
            if (obd.has("engineLoad")) {
                position.set("engineLoad", obd.get("engineLoad").asDouble());
            }
        }

        // Add any additional attributes as generic key-value pairs
        json.fieldNames().forEachRemaining(fieldName -> {
            JsonNode fieldValue = json.get(fieldName);
            if (!isStandardField(fieldName) && fieldValue.isValueNode()) {
                if (fieldValue.isTextual()) {
                    position.set(fieldName, fieldValue.asText());
                } else if (fieldValue.isNumber()) {
                    position.set(fieldName, fieldValue.asDouble());
                } else if (fieldValue.isBoolean()) {
                    position.set(fieldName, fieldValue.asBoolean());
                }
            }
        });

        positions.add(position);

        return positions.isEmpty() ? null : positions;
    }

    /**
     * Check if field name is a standard/already-parsed field
     */
    private boolean isStandardField(String fieldName) {
        String[] standardFields = {
                "id", "sn", "devid", "time", "lat", "lon", "alt", "acc",
                "speed", "heading", "dir", "mileage", "rpm", "fuel", "temp",
                "battery", "harshAccel", "harshBrake", "harshTurn", "fatigue",
                "phoneUse", "laneDept", "collision", "pedestrian", "recording",
                "storage", "obd"
        };

        for (String field : standardFields) {
            if (field.equals(fieldName)) {
                return true;
            }
        }
        return false;
    }

}
