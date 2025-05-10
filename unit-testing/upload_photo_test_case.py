import unittest
from app import app  
import base64

class UploadPhotoTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    # Verify the Upload of Baby Skin Image for Diagnosis
    def test_upload_photo_predict_success(self):
        fake_image = base64.b64encode(b"fake_image_data").decode('utf-8')
        payload = {'image': fake_image}
        response = self.app.post('/predict', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn('predicted_class', response.get_json())
        self.assertIn('confidence', response.get_json())

    # Verify the Upload of Invalid Baby Skin Image for Diagnosis
    def test_upload_invalid_photo(self):
        # Simulate a missing or invalid image
        payload = {}
        response = self.app.post('/predict', json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn('No image provided', response.get_json().get('error'))

if __name__ == '__main__':
    unittest.main()
