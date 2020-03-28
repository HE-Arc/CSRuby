from rest_framework import serializers
from .models import *
from django.forms import ModelForm
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSRuby_User
        fields = ('id','email', 'username', 'steamid', 'date_joined', 'user_item_set')

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSRuby_User
        fields = ('id','email', 'username', 'steamid', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CSRuby_User.objects.create_user(validated_data['email'],
        validated_data['username'], validated_data['password'])

        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect credentials")

class ItemSerializer(serializers.ModelSerializer):
    lowest_price = serializers.SerializerMethodField('get_lowest_price')
    lowest_prices = serializers.SerializerMethodField('get_lowest_prices')
    median_prices = serializers.SerializerMethodField('get_median_prices')
    timestamps = serializers.SerializerMethodField('get_timestamps')
    buyers = serializers.SerializerMethodField('get_buyers')
    sellers = serializers.SerializerMethodField('get_sellers')

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
    def get_buyers(self, item):
        return item.user_item_set.filter(buy_item__exact='1').values('id', 'user__email', 'user__username', 'buy_created_at')
    def get_sellers(self, item):
        return item.user_item_set.filter(sell_item__exact='1').values('id', 'user__email', 'user__username', 'sell_created_at')

    class Meta:
        model = Item
        fields = ('item_id','name','item_image','rarity', 'lowest_price', 'lowest_prices', 'median_prices', 'timestamps', 'buyers', 'sellers')

class ItemActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('item_id','name','item_image','rarity', 'lowest_price', 'lowest_prices', 'median_prices', 'timestamps')

class UserItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_Item
        fields = ('id','item','user','buy_created_at','sell_created_at', 'buy_item', 'sell_item', 'favorite_item')
