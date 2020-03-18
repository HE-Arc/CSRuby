from rest_framework import serializers
from .models import *
from django.forms import ModelForm
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','email', 'profilename', 'password', 'steamid','created_at')

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        instance.password = make_password(password)

        instance.save()
        return instance

class ItemSerializer(serializers.ModelSerializer):
    lowest_price = serializers.SerializerMethodField('get_lowest_price')
    lowest_prices = serializers.SerializerMethodField('get_lowest_prices')
    median_prices = serializers.SerializerMethodField('get_median_prices')
    timestamps = serializers.SerializerMethodField('get_timestamps')

    def get_lowest_price(self, item):
        try:
            return item.price_set.latest('timestamp').lowest_price
        except:
            return None
    def get_lowest_prices(self, item):
        return item.price_set.values('lowest_price')
    def get_median_prices(self, item):
        return item.price_set.values('median_price')
    def get_timestamps(self, item):
        return item.price_set.values('timestamp')

    class Meta:
        model = Item
        fields = ('item_id','name','item_image','rarity', 'lowest_price', 'lowest_prices', 'median_prices', 'timestamps')

class UserItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_Item
        fields = ('id','item','user','buy_created_at','sell_created_at', 'buy_item', 'sell_item', 'favorite_item')
