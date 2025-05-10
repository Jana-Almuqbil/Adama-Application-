import unittest
from app import app 
class LoginTestCase(unittest.TestCase):
    def setUp(self):
        # Set up a test client to simulate requests
        self.app = app.test_client()
        self.app.testing = True

    # Verify Parent Login with Correct Credentials
    def test_login_correct_credentials(self):
        response = self.app.post('/login', json={
            'email': 'parent@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Login successful', response.data)

    # Verify Parent Login with Incorrect Credentials
    def test_login_incorrect_email(self):
        response = self.app.post('/login', json={
            'email': 'wrong@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 401)
        self.assertIn(b'Invalid email or password', response.data)

    def test_login_incorrect_password(self):
        response = self.app.post('/login', json={
            'email': 'parent@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 401)
        self.assertIn(b'Invalid email or password', response.data)

if __name__ == '__main__':
    unittest.main()
