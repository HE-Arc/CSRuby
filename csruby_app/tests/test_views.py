from django.test import TestCase
from selenium import webdriver

class DashboardTestCase(TestCase):
    """This class is used to test the dashboard view using django.test package"""

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_dashboard(self):
        self.driver.get('http://localhost:8000/dashboard')
        self.assertIn('http://localhost:8000/dashboard', self.driver.current_url)

    def tearDown(self):
        self.driver.quit

class SignupTestCase(TestCase):
    """This class is used to test the signup view using django.test package"""

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_signup_good(self):
        self.driver.get('http://localhost:8000/signup')
        self.driver.find_element_by_id('email').send_keys('user@domain.com')
        self.driver.find_element_by_id('profilename').send_keys('user1')
        self.driver.find_element_by_id('password').send_keys('securepassword')
        self.driver.find_element_by_id('password_confirm').send_keys('securepassword')
        self.driver.find_element_by_id('submit').click()
        self.driver.assertIn('http://localhost:8000/dashboard', self.driver.current_url)

    def test_signup_bad(self):
        self.driver.get('http://localhost:8000/signup')
        self.driver.find_element_by_id('email').send_keys('user.domain.com')
        self.driver.find_element_by_id('profilename').send_keys('^#~@@#%&_user1')
        self.driver.find_element_by_id('password').send_keys('badpass')
        self.driver.find_element_by_id('password_confirm').send_keys('')
        self.driver.find_element_by_id('submit').click()
        self.driver.assertIn('http://localhost:8000/signup', self.driver.current_url)

    def tearDown(self):
        self.driver.quit

class SigninTestCase(TestCase):
    """This class is used to test the signin view using django.test package"""

    def setUp(self):
        self.driver = webdriver.Chrome()

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_signin_good(self):
        self.driver.get('http://localhost:8000/signin')
        self.driver.find_element_by_id('email').send_keys('user@domain.com')
        self.driver.find_element_by_id('password').send_keys('securepassword')
        self.driver.find_element_by_id('submit').click()
        self.driver.assertIn('http://localhost:8000/dashboard', self.driver.current_url)

    def test_signin_bad(self):
        self.driver.get('http://localhost:8000/signin')
        self.driver.find_element_by_id('email').send_keys('user.domain.com')
        self.driver.find_element_by_id('password').send_keys('badpass')
        self.driver.find_element_by_id('submit').click()
        self.driver.assertIn('http://localhost:8000/signin', self.driver.current_url)

    def tearDown(self):
        self.driver.quit

class SearchTestCase(TestCase):
    """This class is used to test the signup view using django.test package"""

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_search_page_access(self):
        self.driver.get('http://localhost:8000/dashboard')
        self.driver.find_element_by_id('search_button').click()
        self.driver.assertIn('http://localhost:8000/search', self.driver.current_url)

    def test_search_good(self):
        self.driver.get('http://localhost:8000/dashboard')
        self.driver.find_element_by_id('search').send_keys('Karambit')
        self.driver.find_element_by_id('search_button').click()
        self.driver.assertIn('http://localhost:8000/search', self.driver.current_url)
        self.driver.assertNotIn('No results found', self.driver.page_source)

    def test_search_bad(self):
        self.driver.get('http://localhost:8000/dashboard')
        self.driver.find_element_by_id('search').send_keys('^^##@#---__')
        self.driver.find_element_by_id('search_button').click()
        self.driver.assertIn('http://localhost:8000/search', self.driver.current_url)
        self.driver.assertIn('No results found', self.driver.page_source)

    def tearDown(self):
        self.driver.quit

class ProfileTestCase(TestCase):
    """This class is used to test the profile view using django.test package"""

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_profile_page_access(self):
        self.driver.get('http://localhost:8000/profile/user')
        self.driver.assertIn('http://localhost:8000/profile/user', self.driver.current_url)

    def tearDown(self):
        self.driver.quit
