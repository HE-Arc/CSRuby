from django.db import models
from django.db.models.signals import post_save, post_delete
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from django.utils import timezone
import pytz

class CSRuby_UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, steamid=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            steamid=steamid,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

class CSRuby_User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )

    username = models.CharField(max_length=150)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    steamid = models.CharField(max_length=17, default=None, blank=True, null=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)

    USERNAME_FIELD = 'email'

    objects = CSRuby_UserManager()

class Item(models.Model):
    class Rarity(models.TextChoices):
        CONSUMER_GRADE = 'COG', _('Consumer grade')
        INDUSTRIAL_GRADE = 'ING', _('Industrial grade')
        MIL_SPEC = 'MIS', _('Mil-spec')
        RESTRICTED = 'RST', _('Restricted')
        CLASSIFIED = 'CLA', _('Classified')
        COVERT = 'COV', _('Covert')
        EXCEEDINGLY_RARE = 'EXR', _('Exceedingly Rare')
        CONTRABAND = 'CON', _('Contraband')
        REMARKABLE_STICKER = 'RES', _('Remarkable Sticker')
        HIGH_GRADE_STICKER = 'HGS', _('High Grade Sticker')
        EXTRAORDINARY_STICKER = 'EXS', _('Extraordinary Sticker')
        EXTRAORDINARY_GLOVES = 'EXG', _('Extraordinary Gloves')
        CRATE = 'CRT', _('Crate')


    item_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    item_image = models.CharField(max_length=255)
    rarity = models.CharField(max_length=3, choices=Rarity.choices, default=Rarity.CONSUMER_GRADE,)

class Price(models.Model):
    price_id = models.AutoField(primary_key=True)
    item_id = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
    timestamp = models.DateTimeField()
    lowest_price = models.FloatField()
    median_price = models.FloatField(null=True)


class User_ItemManager(models.Manager):
    def create_buy(self, item, user, buy_created_at=timezone.now(), buy_item=True):
        user_item = self.create(item=item, user=user, buy_created_at=buy_created_at, sell_created_at=None, buy_item=buy_item, sell_item=False, favorite_item=False)
        return user_item

    def create_sell(self, item, user, sell_created_at=timezone.now(), sell_item=True):
        user_item = self.create(item=item, user=user, buy_created_at=None, sell_created_at=sell_created_at, buy_item=False, sell_item=True, favorite_item=False)
        return user_item

    def create_fav(self, item, user, favorite_item=True):
        user_item = self.create(item=item, user=user, buy_created_at=None, sell_created_at=None, buy_item=False, sell_item=False, favorite_item=favorite_item)
        return user_item

class User_Item(models.Model):
    item=models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
    user=models.ForeignKey(CSRuby_User, on_delete=models.CASCADE, null=True)
    buy_created_at=models.DateTimeField(null=True)
    sell_created_at=models.DateTimeField(null=True)
    buy_item=models.BooleanField(default=False)
    sell_item=models.BooleanField(default=False)
    favorite_item=models.BooleanField(default=False)

    objects = User_ItemManager()
