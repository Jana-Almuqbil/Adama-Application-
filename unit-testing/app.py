from flask import Flask, request, jsonify, redirect
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Fake users database
fake_users = {
    'parent@example.com': generate_password_hash('password123') 
}

# Route to login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400

    stored_password_hash = fake_users.get(email)
    if stored_password_hash and check_password_hash(stored_password_hash, password):
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401

# Photo upload prediction route
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    if not data or 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    predicted_class = "Eczema"
    confidence = 0.92

    return jsonify({
        'predicted_class': predicted_class,
        'confidence': confidence
    })

# Diagnosis result route
@app.route('/result', methods=['GET'])
def get_result():
    diagnosis_result = {
        "predicted_class": "Eczema",
        "confidence": 95.2,
        "treatment": "Apply moisturizer twice daily and avoid irritants."
    }
    return jsonify(diagnosis_result), 200

# Baby profile creation route
@app.route('/create_baby_profile', methods=['POST'])
def create_baby_profile():
    data = request.get_json()
    name = data.get('name')
    dob = data.get('dob')
    gender = data.get('gender')

    if not name or not dob or not gender:
        return jsonify({'message': 'Missing fields'}), 400

    return jsonify({'message': 'Baby profile created successfully'}), 201

# Change password route
@app.route('/change_password', methods=['POST'])
def change_password():
    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if old_password == 'OldPass123!':
        return jsonify({"message": "Password changed successfully"}), 200
    else:
        return jsonify({"message": "Old password incorrect"}), 401


# Run the server
if __name__ == '__main__':
    app.run(debug=True)
