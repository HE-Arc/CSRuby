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
    email = models.CharField(max_length=255)
    profilename = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    steamid = models.CharField(max_length=17)
    created_at = models.DateTimeField(auto_now_add=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE, null=True)

class Item(models.Model):
    class Rarity(models.TextChoices):
        CONSUMER_GRADE = 'COG', _('Consumer grade')
        INDUSTRIAL_GRADE = 'ING', _('Industrial grade')
        MIL_SPEC = 'MIS', _('Mil-spec')
        RESTRICTED = 'RES', _('Restricted')
        CLASSIFIED = 'CLA', _('Classified')
        COVERT = 'COV', _('Covert')
        EXCEEDINGLY_RARE = 'EXR', _('Exceedingly Rare')
        CONTRABAND = 'CON', _('Contraband')

    item_id= models.BigIntegerField()
    name = models.CharField(max_length=255)
    item_image = models.CharField(max_length=255)
    rarity = models.CharField(max_length=3,choices=Rarity.choices,default=Rarity.CONSUMER_GRADE,)
