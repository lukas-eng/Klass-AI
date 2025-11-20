from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)
DB_PATH = os.path.join(os.path.dirname(__file__), '../data/db.json')

# Helper function to load database
def build_prompt(question, userId):
    return f"Usuario: {userId}\nPregunta: {question}"
def load_db():
    with open(DB_PATH, 'r') as file:
        return json.load(file)

# Helper function to save database
def save_db(data):
    with open(DB_PATH, 'w') as file:
        json.dump(data, file, indent=2)

# Endpoint to register a new user
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not username or not password or not role:
        return jsonify({"error": "Missing fields: username, password, and role are required."}), 400

    db = load_db()

    # Check if user already exists
    if any(user['username'] == username for user in db.get('users', [])):
        return jsonify({"error": "User already exists."}), 400

    # Add new user
    new_user = {"username": username, "password": password, "role": role}
    db.setdefault('users', []).append(new_user)
    save_db(db)

    return jsonify({"message": "User registered successfully."}), 201

# Endpoint to login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing fields: username and password are required."}), 400

    db = load_db()

    # Validate user credentials
    user = next((user for user in db.get('users', []) if user['username'] == username and user['password'] == password), None)
    if not user:
        return jsonify({"error": "Invalid username or password."}), 401

    return jsonify({"message": "Login successful.", "role": user['role']}), 200

if __name__ == '__main__':
    app.run(debug=True, port=8000)
