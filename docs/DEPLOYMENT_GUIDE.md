# Traccar Hybrid Deployment Guide

This guide details how to deploy the **Traccar Web App** (Frontend) to **Netlify** and the **Traccar Server** (Backend) to **Azure**.

## Part 1: Prerequisites

1.  **Netlify Account**: Can act as "Owner" for the site.
2.  **Azure Account**: Access to create a Virtual Machine.
3.  **GitHub Repo**: Ensure your `traccar-web-app` code is pushed to GitHub.

## Part 2: Backend (Azure Setup)

We start with the backend because you'll need its IP address for the frontend.

1.  **Create Azure VM**:
    - **Image**: Ubuntu Server 22.04 LTS (x64)
    - **Size**: Standard B2s (2 vCPUs, 4 GiB memory) or larger.
    - **Inbound Ports**: Allow SSH (22), HTTP (80), 8082 (Custom), 5055 (GPS), 23913 (Dashcam).
    - *Tip: Set the IP to Static/Public if possible so it doesn't change on reboot.*

2.  **Run Setup Script**:
    SSH into your new VM:
    ```bash
    ssh azureuser@<YOUR_VM_PUBLIC_IP>
    ```

    Copy the setup script contents (from `setup-azure-backend.sh`) and run it:
    ```bash
    # Create the file
    nano setup.sh
    # Paste content, save (Ctrl+O) and exit (Ctrl+X)
    
    # Run it
    sudo bash setup.sh
    ```

3.  **Verify**:
    Once the script finishes, verify the server is responding:
    ```bash
    curl http://localhost:8082/api/server
    ```
    You should see a JSON response.

    **Copy your Public IP Address.** You will need it for Part 3.

## Part 3: Frontend (Netlify Setup)

1.  **Update Configuration**:
    - Open `netlify.toml` in your repository.
    - Replace `YOUR_AZURE_IP` with the actual Public IP of your Azure VM.
    - Commit and push this change to GitHub.

2.  **Deploy to Netlify**:
    - Log in to Netlify.
    - Click **"Add new site"** > **"Import from Git"**.
    - Select **GitHub** and authorize.
    - Choose the `traccar-web-app` repository.
    - **Build Settings** (should be auto-detected from `netlify.toml`):
        - **Base directory**: `web`
        - **Build command**: `npm run build`
        - **Publish directory**: `dist`
    - Click **"Deploy site"**.

## Part 4: Final checks

1.  Open your new Netlify URL (e.g., `https://my-traccar-app.netlify.app`).
2.  Open the Browser Developer Tools (F12) -> Network Tab.
3.  Refresh the page.
4.  Look for requests to `/api/server`.
    - They should return `200 OK`.
    - If you inspect them, they are being "proxied" by Netlify to your Azure IP.

## Troubleshooting

-   **Frontend loads but Login fails**: Check if the Azure VM firewall allows port 8082 from "Anywhere".
-   **Devices not connecting**: Ensure the specific device protocol port (e.g., 5055 for Traccar Client) is open in Azure Networking.
