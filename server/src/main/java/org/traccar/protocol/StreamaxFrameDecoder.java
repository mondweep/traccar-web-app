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
import org.traccar.BaseFrameDecoder;

/**
 * Frame decoder for Streamax protocol messages
 *
 * Streamax protocol uses JSON-formatted messages over TCP/IP.
 * Each message is a complete JSON object terminated with a newline (\n).
 *
 * Message format:
 * {JSON object containing position, telemetry, and event data}\n
 *
 * Example:
 * {"id":"XXXXX","time":"2024-01-01T12:00:00","lat":40.7128,"lon":-74.0060,"speed":45,"heading":90,...}\n
 */
public class StreamaxFrameDecoder extends BaseFrameDecoder {

    @Override
    protected Object decode(ChannelHandlerContext ctx, Channel channel, ByteBuf buf) throws Exception {
        // Find the end of the message (newline character)
        int endIndex = buf.indexOf(buf.readerIndex(), buf.writerIndex(), (byte) '\n');

        // If newline not found, wait for more data
        if (endIndex < 0) {
            return null;
        }

        // Calculate frame length (including the newline)
        int length = endIndex - buf.readerIndex() + 1;

        // Extract the frame (excluding the newline)
        ByteBuf frame = buf.readRetainedSlice(length - 1);

        // Skip the newline
        buf.skipBytes(1);

        return frame;
    }

}
