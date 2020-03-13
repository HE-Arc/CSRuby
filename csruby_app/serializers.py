from rest_framework import serializers
from .models import User, Item, Price

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','email', 'profilename', 'password', 'steamid','created_at')

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('item_id','name','item_image','rarity')

class ItemPricesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = ('price_id', 'item_id', 'timestamp', 'lowest_price', 'median_price')
