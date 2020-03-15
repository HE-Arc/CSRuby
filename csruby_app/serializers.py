from rest_framework import serializers
from .models import User, Item, Price

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','email', 'profilename', 'password', 'steamid','created_at')

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
