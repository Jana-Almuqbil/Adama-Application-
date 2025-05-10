from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import base64
import io

# 1. Load the model
model = tf.keras.models.load_model("adama_densenet_model.h5")
class_names = ['Eczema', 'Psoriasis']

# 2. Setup Flask
app = Flask(__name__)
CORS(app)

# 3. Handle Image Input and Return Diagnosis Result
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        image_data = data['image']

        # Remove base64 header if present to prevent errors
        if "," in image_data:
            image_data = image_data.split(",")[1]

        # Preprocess the image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image = image.resize((224, 224))
        image_array = np.expand_dims(np.array(image) / 255.0, axis=0)

        predictions = model.predict(image_array)[0]
        predicted_class = class_names[np.argmax(predictions)]
        confidence = float(np.max(predictions)) * 100

        response = {
            'predicted_class': predicted_class,
            'confidence': confidence
        }
        print("Prediction response:", response)
        return jsonify(response)
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)})

# 4. Run the Server
if __name__ == '__main__':
    app.run(port=5000)
