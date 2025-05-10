import unittest
from app import app

class ChangePasswordTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    # Verify the Successful Change of Account Password
    def test_change_password_success(self):
        response = self.app.post('/change_password', json={
            'old_password': 'OldPass123!',
            'new_password': 'NewPass123!'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Password changed successfully', response.data)

    # Verify the Failure of Account Password Change with Invalid Data
    def test_change_password_wrong_old_password(self):
        response = self.app.post('/change_password', json={
            'old_password': 'WrongOldPass!',
            'new_password': 'NewPass123!'
        })
        self.assertEqual(response.status_code, 401)
        self.assertIn(b'Old password incorrect', response.data)


if __name__ == '__main__':
    unittest.main()
