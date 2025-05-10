import unittest
from app import app

class ResultDisplayTestCase(unittest.TestCase):

    def setUp(self):
        # Setup before each test
        self.app = app.test_client()
        self.app.testing = True

    # Verify the Display of Diagnosis Result and Treatment
    def test_display_result_success(self):
        response = self.app.get('/result')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('predicted_class', data)
        self.assertIn('confidence', data)
        self.assertIn('treatment', data)

    def test_display_result_content(self):
        response = self.app.get('/result')
        data = response.get_json()
        self.assertEqual(data['predicted_class'], 'Eczema')
        self.assertAlmostEqual(data['confidence'], 95.2)
        self.assertTrue(data['treatment'].startswith('Apply moisturizer'))

if __name__ == '__main__':
    unittest.main()
