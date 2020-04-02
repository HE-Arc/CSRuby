from django.db import models
from django.db.models.signals import post_save, post_delete
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
import pytz

class CSRuby_UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, steamid=None):
        """
        Creates and saves a User with the given email and password.
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

    def get_user_trades(self, user_id):
        buy_orders = None
        buy_orders_item_ids = set()
        items_to_buy = []

        sell_orders = None
        sell_orders_item_ids = set()
        items_to_sell = []

        favorite_user_items = None
        favorite_item_ids = set()
        favorite_items = []

        # Get the items from the buy and sell orders
        if User_Item.objects.filter(buy_item__exact='1', user_id__exact=user_id).exists():
            buy_orders = User_Item.objects.filter(buy_item__exact='1', user_id__exact=user_id).all()

            buy_orders_item_ids = {buy_order.item_id for buy_order in buy_orders}
            items_to_buy = [Item.objects.get(item_id__exact=item_id) for item_id in buy_orders_item_ids]

        if User_Item.objects.filter(sell_item__exact='1', user_id__exact=user_id).exists():
            sell_orders = User_Item.objects.filter(sell_item__exact='1', user_id__exact=user_id).all()

            sell_orders_item_ids = {sell_order.item_id for sell_order in sell_orders}
            items_to_sell = [Item.objects.get(item_id__exact=item_id) for item_id in sell_orders_item_ids]

        if User_Item.objects.filter(favorite_item__exact='1', user_id__exact=user_id).exists():
            favorite_user_items = User_Item.objects.filter(favorite_item__exact='1', user_id__exact=user_id).all()

            favorite_item_ids = {favorite_item.item_id for favorite_item in favorite_user_items}
            favorite_items = [Item.objects.get(item_id__exact=item_id) for item_id in favorite_item_ids]
        return items_to_buy, items_to_sell, favorite_items

    def patch_user(self, user_id, request):
        user = None

        user = CSRuby_User.objects.get(id__exact=user_id)

        if request.data['username']:
            username = request.data['username']
            user.username = username

        steamid = request.data['steamid']
        user.steamid = steamid

        if request.data['password']:
            password = request.data['password']
            user.set_password(password)

        user.save()

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

class ItemManager(models.Manager):
    def get_most_expensive_item(self, queryset):
        lowest_price = -1

        for item in queryset:
            current_lowest_price = float(item.price_set.latest('timestamp').lowest_price)
            if current_lowest_price > lowest_price:
                lowest_price = current_lowest_price

        for item in queryset:
            current_lowest_price = float(item.price_set.latest('timestamp').lowest_price)
            if lowest_price > current_lowest_price:
                queryset = queryset.exclude(item_id=item.item_id)
        return queryset

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

    objects = ItemManager()

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

    def patch_trade(self, request):
        action = ''
        user = ''
        intention = ''
        possible_actions = ['buy', 'sell', 'fav']

        if request.data['action'] and request.data['authed_user'] and request.data['intention']:
            action = request.data['action']
            user = request.data['authed_user']
            intention = request.data['intention']
            user_item = None

            if action == 'buy':
                if request.data['trade']:
                    trade = request.data['trade']
                    try:
                        user_item = User_Item.objects.get(id__exact=trade)
                    except Exception as e:
                        return Response(data={'detail': 'Trade not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    response = Response(data={'detail': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    if intention == 'add':
                        user_item.buy_item = True
                        user_item.buy_created_at = timezone.now()
                        response = Response(data={'detail': 'Buy order added', 'action': action})

                    if intention == 'remove':
                        user_item.buy_item = False
                        user_item.buy_created_at = None
                        response = Response(data={'detail': 'Buy order removed', 'action': action})

                    user_item.save()

                    return response

            if action == 'sell':
                if request.data['trade']:
                    trade = request.data['trade']
                    try:
                        user_item = User_Item.objects.get(id__exact=trade)
                    except Exception as e:
                        return Response(data={'detail': 'Trade not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    response = Response(data={'detail': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    if intention == 'add':
                        user_item.sell_item = True
                        user_item.sell_created_at = timezone.now()
                        response = Response(data={'detail': 'Sell order added', 'action': action})

                    if intention == 'remove':
                        user_item.sell_item = False
                        user_item.sell_created_at = None
                        response = Response(data={'detail': 'Sell order removed', 'action': action})

                    user_item.save()

                    return response

            if action == 'fav':
                if request.data['item_id'] and request.data['authed_user']:
                    try:
                         user_item = User_Item.objects.get(user__exact=request.data['authed_user'], item__exact=request.data['item_id'])
                    except Exception as e:
                        return Response(data={'detail': 'Trade not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    response = Response(data={'detail': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    if intention == 'add':
                        user_item.favorite_item = True
                        response = Response(data={'detail': 'Added item to favorites', 'action': action, 'favorite_item': True})

                    if intention == 'remove':
                        user_item.favorite_item = False
                        response = Response(data={'detail': 'Removed item from favorites', 'action': action, 'favorite_item': False})

                    user_item.save()

                    return response
        return Response(data={'detail': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class User_Item(models.Model):
    item=models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
    user=models.ForeignKey(CSRuby_User, on_delete=models.CASCADE, null=True)
    buy_created_at=models.DateTimeField(null=True)
    sell_created_at=models.DateTimeField(null=True)
    buy_item=models.BooleanField(default=False)
    sell_item=models.BooleanField(default=False)
    favorite_item=models.BooleanField(default=False)

    objects = User_ItemManager()
