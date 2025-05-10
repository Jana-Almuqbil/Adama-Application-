# test_model_database_integration.py
import firebase_admin
from firebase_admin import credentials, firestore
import requests
import base64
import datetime

# 1. Initialize Firebase Admin SDK
cred = credentials.Certificate('adama-83129-firebase-adminsdk-fbsvc-a9a7b015fd.json')  
firebase_admin.initialize_app(cred)
db = firestore.client()

# 2. Prepare test data
test_image_path = 'Psoriasis-arm.jpg'

# 3. Encode the image to base64
with open(test_image_path, "rb") as img_file:
    encoded_image = base64.b64encode(img_file.read()).decode('utf-8')

# 4. Send data to the model API
api_url = 'http://localhost:5000/predict'  
payload = {
    'image': encoded_image,
}

response = requests.post(api_url, json=payload)
# 5. Process the model response
if response.status_code == 200:
    result = response.json()
    predicted_class = result['predicted_class']
    accuracy = result['confidence']

    print(f"Diagnosis detected: {predicted_class} ({accuracy}% confidence)")

    # 6. Store the diagnosis result in Firestore
    doc_ref = db.collection('Test_new_case').document('testCase1')
    
    case_data = {
        'Diagnosis': predicted_class,
        'Accuracy': accuracy,
        'Timestamp': datetime.datetime.now().isoformat()
    }
    
    doc_ref.set(case_data)  # Overwrite 'testCase1' with the new data

    print("Diagnosis successfully stored under 'Test_new_case/testCase1'.")

else:
    print(f"Model API Error: {response.status_code} - {response.text}")
