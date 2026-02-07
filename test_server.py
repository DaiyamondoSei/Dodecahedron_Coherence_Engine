#!/usr/bin/env python3
"""
Quannex POC Test Server
========================

Simple HTTP server for local testing with CORS enabled.

Usage:
    python test_server.py

Then open:
    http://localhost:8000/pages/demo-orchestrator.html
    http://localhost:8000/pages/dodecahedron-3d.html

Features:
- CORS enabled for AI API calls
- Serves all static files (HTML, JS, CSS)
- Auto-reloads on file changes (Ctrl+C to stop)
"""

import http.server
import socketserver
import os

PORT = 8000

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP handler with CORS headers for local testing."""

    def end_headers(self):
        """Add CORS headers to every response."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        """Handle preflight requests."""
        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        """Custom logging format."""
        print(f"[{self.log_date_time_string()}] {format % args}")

if __name__ == '__main__':
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    print("=" * 60)
    print("🌟 Quannex POC Test Server")
    print("=" * 60)
    print(f"\nServer running at: http://localhost:{PORT}")
    print("\nTest Pages:")
    print(f"  • Orchestrator:    http://localhost:{PORT}/pages/demo-orchestrator.html")
    print(f"  • 3D Dodecahedron: http://localhost:{PORT}/pages/dodecahedron-3d.html")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 60)
    print()

    try:
        with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✓ Server stopped")
        print("=" * 60)
