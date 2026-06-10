#!/usr/bin/env python3
"""Generate Nginx config from apps.json"""

import json
import sys
from pathlib import Path

def generate_nginx_config(apps_file="apps.json"):
    with open(apps_file) as f:
        config = json.load(f)

    apps = config["apps"]
    domain = config["settings"]["domain"]
    email = config["settings"]["email"]

    # Generate upstream blocks
    upstreams = ""
    for app in apps:
        upstreams += f"""
upstream {app['name']} {{
    server host.docker.internal:{app['port']};
}}
"""

    # Generate server blocks for each subdomain + root domain
    servers = ""
    for app in apps:
        subdomain = app["subdomain"]
        servers += f"""
server {{
    server_name {subdomain}.{domain};
    location / {{
        proxy_pass http://{app['name']};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }}
}}
"""

    # Root domain redirects to invoice
    servers += f"""
server {{
    server_name {domain};
    location / {{
        proxy_pass http://invoice;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }}
}}
"""

    nginx_conf = f"""user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {{
    worker_connections 1024;
}}

http {{
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml+rss
               application/atom+xml image/svg+xml;

{upstreams}

{servers}
}}
"""

    return nginx_conf

if __name__ == "__main__":
    config_file = sys.argv[1] if len(sys.argv) > 1 else "apps.json"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "nginx.conf"

    nginx_config = generate_nginx_config(config_file)

    with open(output_file, "w") as f:
        f.write(nginx_config)

    print(f"[OK] Generated {output_file}")
    print("\nUpstreams and servers configured:")
    config = json.load(open(config_file))
    for app in config["apps"]:
        print(f"  - {app['subdomain']}.{config['settings']['domain']} -> localhost:{app['port']} ({app['name']})")
