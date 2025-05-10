import unittest
from app import app

class BabyProfileTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    # Verify the Creation of a New Baby Profile with Valid Data
    def test_create_baby_profile_success(self):
        response = self.app.post('/create_baby_profile', json={
            "name": "Naif",
            "dob": "20/11/2024",
            "gender": "Male"
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn(b'Baby profile created successfully', response.data)

    # Verify the Creation of a New Baby Profile with Invalid Data
    def test_create_baby_profile_missing_field(self):
        response = self.app.post('/create_baby_profile', json={
            "name": "Naif",
            "dob": "20/11/2024"
            # missing gender
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'Missing fields', response.data)

if __name__ == '__main__':
    unittest.main()
