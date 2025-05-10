import unittest
from app import app
from baby_profile_test_case import BabyProfileTestCase
from change_password_test_case import ChangePasswordTestCase
from login_test_case import LoginTestCase
from result_display_test_case import ResultDisplayTestCase
from upload_photo_test_case import UploadPhotoTestCase

class CentralTestRunner(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    # Run all tests
    def test_all(self):
        result = unittest.TextTestRunner().run(unittest.TestLoader().loadTestsFromTestCase(BabyProfileTestCase))
        self.assertTrue(result.wasSuccessful())
        
        result = unittest.TextTestRunner().run(unittest.TestLoader().loadTestsFromTestCase(ChangePasswordTestCase))
        self.assertTrue(result.wasSuccessful())

        result = unittest.TextTestRunner().run(unittest.TestLoader().loadTestsFromTestCase(LoginTestCase))
        self.assertTrue(result.wasSuccessful())

        result = unittest.TextTestRunner().run(unittest.TestLoader().loadTestsFromTestCase(ResultDisplayTestCase))
        self.assertTrue(result.wasSuccessful())

        result = unittest.TextTestRunner().run(unittest.TestLoader().loadTestsFromTestCase(UploadPhotoTestCase))
        self.assertTrue(result.wasSuccessful())

if __name__ == '__main__':
    unittest.main()
