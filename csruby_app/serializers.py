from rest_framework import serializers
from .models import CSRuby_User, Item, Price, CSRuby_UserManager
from django.forms import ModelForm
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CSRuby_User
        fields = ('id','email', 'username', 'steamid')

    # def create(self, validated_data):
    #     password = validated_data.pop('password', None)
    #     instance = self.Meta.model(**validated_data)
    #     instance.password = make_password(password)
    #
    #     instance.save()
    #     return instance

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
