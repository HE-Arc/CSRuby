from django.db.models.fields import DateTimeField
from django.test import TestCase
from csruby_app.models import *

class UserAndRoleTestCase(TestCase):
    """This class is used to test the User and Role model using django.test package"""

    def setUp(self):
        self.user = User.objects.create(email="user@domain.com", password="securepassword", profilename="user", steamid="61772925218070718")
        self.user_steamdid_bad = User.objects.create(email="user@domain.com", password="securepassword", profilename="user", steamid="1")

        self.role_user = Role.objects.create(name="User")

    def test_user_with_role(self):
        self.user.role.add(self.role_user)
        self.assertTrue(isinstance(self.user, User))
        self.assertTrue(isinstance(self.user.role, Role))
        self.assertTrue(isinstance(self.user.email, basestring))
        self.assertTrue(isinstance(self.user.password, basestring))
        self.assertTrue(isinstance(self.user.profilename, basestring))
        self.assertTrue(isinstance(self.user.steamid, basestring))
        self.assertEqual(len(self.user.steamid), 17)

    def test_user_steamid_bad(self):
        self.assertTrue(isinstance(self.user_steamdid_bad, User))
        self.assertNotEqual(len(self.user_steamdid_bad.steamid), 17)

    def test_role(self):
        self.assertTrue(isinstance(self.role_user, Role))
        self.assertTrue(isinstance(self.role_user.name, basestring))

class ItemTestCase(TestCase):
    """This class is used to test the Item model using django.test package"""

    def setUp(self):
        self.item = Item.objects.create(name="Item", rarity="1", item_image="/static/images/item.png")

    def test_item(self):
        self.assertTrue(isinstance(self.item, Item))
        self.assertTrue(isinstance(self.item.name, basestring))
        self.assertTrue(isinstance(self.item.rarity, basestring))
        self.assertTrue(isinstance(self.item.item_image, basestring))

class PriceTestCase(TestCase):
    """This class is used to test the Price model using django.test package"""

    def setUp(self):
        self.item = Item.objects.create(name="Item", rarity="1", item_image="/static/images/item.png")
        self.price = Price.objects.create(timestamp=DateTimeField(), median_price=1234.0, lowest_price=123.0)

    def test_price_with_item(self):
        self.price.item.add(self.item)
        self.assertTrue(isinstance(self.price, Price))
        self.assertTrue(isinstance(self.price.item, Item))
        self.assertTrue(isinstance(self.price.timestamp, DateTimeField))
        self.assertTrue(isinstance(self.price.median_price, float))
        self.assertTrue(isinstance(self.price.lowest_price, float))
