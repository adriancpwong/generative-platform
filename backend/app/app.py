from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import requests
from pathlib import Path
import logging

# Create Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load manifest file
MANIFEST_PATH = Path(__file__).parent / 'manifest.json'

def load_manifest():
    try:
        with open(MANIFEST_PATH, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading manifest: {e}")
        return {"services": []}

@app.route('/api/services', methods=['GET'])
def get_services():
    manifest = load_manifest()
    return jsonify(manifest)

@app.route('/api/chat/<service_id>', methods=['POST'])
def chat_with_service(service_id):
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"response": "Message is required"}), 400
        
    message = data['message']
    
    manifest = load_manifest()
    service = next((s for s in manifest['services'] if s['id'] == service_id), None)
    
    if not service:
        logger.warning(f"Service {service_id} not found in manifest")
        return jsonify({"response": f"Service {service_id} not found"}), 404
    
    try:
        url = f"http://{service_id}:{service['port']}{service['path']}"
        logger.info(f"Forwarding request to {url}")
        response = requests.post(url, json={"message": message}, timeout=5)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        logger.error(f"Error connecting to {service['name']}: {str(e)}")
        return jsonify({"response": f"Error connecting to {service['name']}"}), 502

# This allows the app to be run directly with python app.py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)