from django.db import models
from django.db.models.signals import post_save, post_delete
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)

# Create your models here.
# class Role(models.Model):
#     class RoleId(models.IntegerChoices):
#         USER = 1
#         ADMIN = 2
#     role_id = models.IntegerField(choices=RoleId.choices, default=RoleId.USER);
#     name = models.CharField(max_length=255, default="User")

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
            steamid=steamid
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, date_of_birth, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            date_of_birth=date_of_birth,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class CSRuby_User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )

    username=models.CharField(max_length=150)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    steamid = models.CharField(max_length=17, default=None, blank=True, null=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)

    USERNAME_FIELD = 'email'

    objects = CSRuby_UserManager()

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    # def has_module_perms(self, app_label):
    #     "Does the user have permissions to view the app `app_label`?"
    #     # Simplest possible answer: Yes, always
    #     return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


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
    user=models.ForeignKey(CSRuby_User, on_delete=models.CASCADE, null=True)
    buy_created_at=models.DateTimeField()
    sell_created_at=models.DateTimeField()
    buy_item=models.BooleanField(default=False)
    sell_item=models.BooleanField(default=False)
    favorite_item=models.BooleanField(default=False)
