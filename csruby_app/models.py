from django.db import models
from django.db.models.signals import post_save, post_delete
from django.utils.translation import gettext_lazy as _

# Create your models here.
class Role(models.Model):
    class RoleId(models.IntegerChoices):
        USER = 1
        ADMIN = 2
    role_id = models.IntegerField(choices=RoleId.choices, default=RoleId.USER);
    name = models.CharField(max_length=255, default="User")

class User(models.Model):
    email = models.EmailField(max_length=255, unique=True)
    profilename = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    steamid = models.CharField(max_length=17, default=None, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE, null=True)

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
        EXTRAORDINARY_GLOES = 'EXG', _('Extraordinary Gloves')

    item_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    item_image = models.CharField(max_length=255)
    rarity = models.CharField(max_length=3,choices=Rarity.choices,default=Rarity.CONSUMER_GRADE,)

class Price(models.Model):
    price_id = models.AutoField(primary_key=True)
    item_id = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
    timestamp = models.DateTimeField()
    lowest_price = models.FloatField()
    median_price = models.FloatField(null=True)

class User_Item(models.Model):
    item=models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
    user=models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    buy_created_at=models.DateTimeField()
    sell_created_at=models.DateTimeField()
    buy_item=models.BooleanField(default=False)
    sell_item=models.BooleanField(default=False)
    favorite_item=models.BooleanField(default=False)
