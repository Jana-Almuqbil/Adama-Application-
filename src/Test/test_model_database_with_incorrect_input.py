import requests
import base64
import os

# Define the API URL
api_url = 'http://localhost:5000/predict'  

# Set the path to the test file
test_file_path = 'Psoriasis-arm.pdf'  # Incorrect file type for testing
valid_extensions = ['.jpg', '.jpeg', '.png', '.gif']

# Check file extension
file_extension = os.path.splitext(test_file_path)[1].lower()

if file_extension not in valid_extensions:
    print(f"Error: '{test_file_path}' is not a valid image file.")
    print("File not sent to the model. Nothing stored in Firebase.")
else:
    try:
        # Read and encode image
        with open(test_file_path, "rb") as file:
            encoded_image = base64.b64encode(file.read()).decode('utf-8')
        # Send to model
        payload = {
            'image': encoded_image,
        }

        response = requests.post(api_url, json=payload)

        if response.status_code == 200:
            result = response.json()
            print(f"Diagnosis detected: {result.get('predicted_class', 'Unknown')}")
        else:
            print(f"Model API Error: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"Failed to process file: {e}")
