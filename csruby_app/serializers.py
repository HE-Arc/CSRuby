from rest_framework import serializers
from .models import User, Item, Price

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','email', 'profilename', 'password', 'steamid','created_at')

class ItemSerializer(serializers.ModelSerializer):
    lowest_price = serializers.SerializerMethodField('get_lowest_price')

    def get_lowest_price(self, item):
        try:
            return item.price_set.latest('timestamp').lowest_price
        except:
            return None
    class Meta:
        model = Item
        fields = ('item_id','name','item_image','rarity','lowest_price')

class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = ('price_id','timestamp', 'lowest_price', 'median_price')
