Cloudflare Tunnel setup
=======================

1. Install Cloudflare Tunnel CLI:
   - https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/

2. Start the app locally:
   - npm install
   - npm start

3. Create a tunnel:
   - cloudflared tunnel create <name>
   - This creates a tunnel and a credentials.json file.

4. Update cloudflared.yml with your tunnel ID and hostname.

5. Run the tunnel:
   - cloudflared tunnel run <tunnel-name>

6. If you want to expose the app through Cloudflare, point the hostname to the tunnel.

Note:
- The app listens on port 8000 by default.
- The CIDR field you need in your networking setup is not a repo setting; it is the private address range that your tunnel target should be reachable from. For a local dev server, use 127.0.0.1/32 (or 0.0.0.0/0 only if you explicitly want to allow all origins).
