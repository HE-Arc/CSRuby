from django.test import TestCase
from csruby_app.models import CSRuby_User, Item, Price
from django.utils import timezone

class UserAndRoleTestCase(TestCase):
    """This class is used to test the User and Role model using django.test package"""

    def setUp(self):
        self.user = CSRuby_User.objects.create(email="user@domain.com", password="securepassword", username="user", steamid="61772925218070718")
        self.user_steamdid_bad = CSRuby_User.objects.create(email="user_bad@domain.com", password="securepassword", username="user", steamid="1")

    def test_user(self):
        self.assertTrue(isinstance(self.user, CSRuby_User))
        self.assertTrue(isinstance(self.user.email, str))
        self.assertTrue(isinstance(self.user.password, str))
        self.assertTrue(isinstance(self.user.username, str))
        self.assertTrue(isinstance(self.user.steamid, str))
        self.assertEqual(len(self.user.steamid), 17)

    def test_user_steamid_bad(self):
        self.assertTrue(isinstance(self.user_steamdid_bad, CSRuby_User))
        self.assertNotEqual(len(self.user_steamdid_bad.steamid), 17)

class ItemTestCase(TestCase):
    """This class is used to test the Item model using django.test package"""

    def setUp(self):
        self.item = Item.objects.create(name="Item", rarity="1", item_image="/static/images/item.png")

    def test_item(self):
        self.assertTrue(isinstance(self.item, Item))
        self.assertTrue(isinstance(self.item.name, str))
        self.assertTrue(isinstance(self.item.rarity, str))
        self.assertTrue(isinstance(self.item.item_image, str))

class PriceTestCase(TestCase):
    """This class is used to test the Price model using django.test package"""

    def setUp(self):
        self.now = timezone.now()
        self.item = Item.objects.create(name="Item", rarity="1", item_image="/static/images/item.png")
        self.price = Price.objects.create(timestamp=self.now, median_price=1234.0, lowest_price=123.0)

    def test_price_with_item(self):
        self.price.item = 0
        self.assertTrue(isinstance(self.price, Price))
        self.assertTrue(isinstance(self.price.item, int))
        self.assertTrue(self.price.timestamp == self.now)
        self.assertTrue(isinstance(self.price.median_price, float))
        self.assertTrue(isinstance(self.price.lowest_price, float))
