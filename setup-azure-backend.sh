#!/bin/bash

# setup-azure-backend.sh
# -------------------------------------------------------------------------
# Automated Setup Script for Traccar Backend on Ubuntu 22.04/24.04 (Azure)
# -------------------------------------------------------------------------
# Usage:
#   1. SSH into your Azure VM: ssh azureuser@YOUR_IP
#   2. Copy this file or curl it.
#   3. Run: sudo bash setup-azure-backend.sh
# -------------------------------------------------------------------------

set -e

# Configuration
REPO_URL="https://github.com/mondweep/traccar-web-app.git"
INSTALL_DIR="/opt/traccar"
SERVICE_NAME="traccar"
JAVA_VERSION="17"

echo ">>> Starting Traccar Backend Setup..."

# 1. System Updates
echo ">>> Updating system packages..."
apt-get update && apt-get upgrade -y

# 2. Install Dependencies
echo ">>> Installing Dependencies (Java $JAVA_VERSION, Git, Unzip)..."
apt-get install -y openjdk-$JAVA_VERSION-jdk-headless git unzip curl

# 3. Create Traccar Directory
echo ">>> Setting up installation directory at $INSTALL_DIR..."
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

# 4. Clone Repository (Building from Source)
# Note: In a real CI/CD pipeline, you might download a pre-built artifact instead.
echo ">>> Cloning repository..."
if [ -d "$INSTALL_DIR/repo" ]; then
    rm -rf "$INSTALL_DIR/repo"
fi
git clone $REPO_URL repo

# 5. Build Server
echo ">>> Building Traccar Server. This might take a few minutes..."
cd repo/server
chmod +x gradlew
./gradlew assemble

# 6. Deploy Artifacts
echo ">>> Deploying build artifacts..."
# Copy the built jar and libs (Standard Traccar layout)
cp target/tracker-server.jar $INSTALL_DIR/
cp -r target/lib $INSTALL_DIR/
cp -r target/schema $INSTALL_DIR/
cp -r templates $INSTALL_DIR/

# 7. Configuration
echo ">>> Creating configuration..."
cat > $INSTALL_DIR/traccar.xml <<EOF
<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE properties SYSTEM 'http://java.sun.com/dtd/properties.dtd'>
<properties>
    <entry key='config.default'>./conf/default.xml</entry>
    
    <!-- Database Configuration (H2 by default, change to MySQL for production) -->
    <entry key='database.driver'>org.h2.Driver</entry>
    <entry key='database.url'>jdbc:h2:./data/database;MODE=MYSQL;</entry>
    <entry key='database.user'>sa</entry>
    <entry key='database.password'></entry>

    <!-- Web Server Port (Backend API) -->
    <entry key='web.port'>8082</entry>
    
    <!-- Enable Cross-Origin for Netlify -->
    <entry key='web.origin'>*</entry>
</properties>
EOF

mkdir -p $INSTALL_DIR/data
mkdir -p $INSTALL_DIR/logs
mkdir -p $INSTALL_DIR/conf
# Copy default config from source if available, otherwise minimal
if [ -f "setup/default.xml" ]; then
    cp setup/default.xml $INSTALL_DIR/conf/
else
    # Fallback to fetching default.xml from official repo if missing in source
    curl -o $INSTALL_DIR/conf/default.xml https://raw.githubusercontent.com/traccar/traccar/master/setup/default.xml
fi


# 8. Create Systemd Service
echo ">>> Creating Systemd Service..."
cat > /etc/systemd/system/$SERVICE_NAME.service <<EOF
[Unit]
Description=Traccar GPS Tracking System
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/java -jar tracker-server.jar conf/traccar.xml
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 9. Start Service
echo ">>> Starting Traccar Service..."
systemctl daemon-reload
systemctl enable $SERVICE_NAME
systemctl start $SERVICE_NAME

# 10. Open Firewall Ports (UFW) if active
if ufw status | grep -q "Status: active"; then
    echo ">>> Configured Firewall..."
    ufw allow 8082/tcp  # API
    ufw allow 5055/tcp  # Traccar Client Protocol
    ufw allow 23913/tcp # Streamax Protocol
    ufw allow 22/tcp    # SSH
fi

echo "----------------------------------------------------------------"
echo ">>> Setup Complete!"
echo ">>> Backend is running on port 8082"
echo ">>> Your public API URL: http://$(curl -s ifconfig.me):8082/api"
echo "----------------------------------------------------------------"
